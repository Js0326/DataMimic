import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import { storage } from "./storage";
import { insertDatasetSchema, insertGenerationSchema } from "@shared/schema";

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload dataset endpoint
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const csvData = req.file.buffer.toString('utf-8');
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const dataRows = lines.slice(1);

      // Analyze columns
      const columns = headers.map((name, index) => {
        const columnValues = dataRows.map(row => {
          const cells = row.split(',');
          return cells[index]?.trim() || '';
        });

        const nonEmptyValues = columnValues.filter(v => v !== '');
        const nullCount = columnValues.length - nonEmptyValues.length;
        
        // Check if numeric
        const isNumeric = nonEmptyValues.slice(0, 100).every(v => !isNaN(Number(v)));

        return {
          name,
          type: isNumeric ? 'numeric' as const : 'categorical' as const,
          nullCount,
        };
      });

      // Create dataset in database
      const dataset = await storage.createDataset({
        name: req.file.originalname,
        originalFilename: req.file.originalname,
        rowCount: dataRows.length,
        columnCount: headers.length,
        columns,
        fileData: csvData,
      });

      res.json({
        success: true,
        dataset: {
          id: dataset.id,
          name: dataset.name,
          rowCount: dataset.rowCount,
          columnCount: dataset.columnCount,
          columns: dataset.columns,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload dataset' });
    }
  });

  // Get all datasets
  app.get('/api/datasets', async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json({ datasets });
    } catch (error) {
      console.error('Get datasets error:', error);
      res.status(500).json({ error: 'Failed to fetch datasets' });
    }
  });

  // Get dataset by ID
  app.get('/api/datasets/:id', async (req, res) => {
    try {
      const dataset = await storage.getDataset(req.params.id);
      if (!dataset) {
        return res.status(404).json({ error: 'Dataset not found' });
      }
      res.json({ dataset });
    } catch (error) {
      console.error('Get dataset error:', error);
      res.status(500).json({ error: 'Failed to fetch dataset' });
    }
  });

  // Generate synthetic data
  app.post('/api/generate', async (req, res) => {
    try {
      const { datasetId, modelType, parameters } = req.body;

      // Get dataset
      const dataset = await storage.getDataset(datasetId);
      if (!dataset) {
        return res.status(404).json({ error: 'Dataset not found' });
      }

      // Create generation record
      const generation = await storage.createGeneration({
        datasetId,
        modelType: modelType || 'copula',
        status: 'processing',
        parameters: parameters || {},
        syntheticData: null,
        errorMessage: null,
        completedAt: null,
      });

      // Call Python script to generate synthetic data
      const pythonScript = path.join(process.cwd(), 'python_scripts', 'generate_synthetic.py');
      const inputData = JSON.stringify({
        csvData: dataset.fileData,
        modelType: modelType || 'copula',
        rowCount: dataset.rowCount,
        parameters: parameters || {},
      });

      const pythonProcess = spawn('python3', [pythonScript, inputData]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', async (code) => {
        try {
          if (code !== 0) {
            await storage.updateGeneration(generation.id, {
              status: 'failed',
              errorMessage: errorOutput || 'Python script failed',
              completedAt: new Date(),
            });
            return res.status(500).json({ error: 'Generation failed', details: errorOutput });
          }

          const result = JSON.parse(output);

          if (!result.success) {
            await storage.updateGeneration(generation.id, {
              status: 'failed',
              errorMessage: result.error,
              completedAt: new Date(),
            });
            return res.status(500).json({ error: result.error });
          }

          // Update generation with synthetic data
          const updatedGeneration = await storage.updateGeneration(generation.id, {
            status: 'completed',
            syntheticData: result.syntheticData,
            completedAt: new Date(),
          });

          // Create evaluation record
          const evaluation = await storage.createEvaluation({
            generationId: generation.id,
            ...result.evaluation,
          });

          res.json({
            success: true,
            generation: updatedGeneration,
            evaluation,
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
          await storage.updateGeneration(generation.id, {
            status: 'failed',
            errorMessage: 'Failed to parse generation result',
            completedAt: new Date(),
          });
          res.status(500).json({ error: 'Failed to process generation result' });
        }
      });

    } catch (error) {
      console.error('Generation error:', error);
      res.status(500).json({ error: 'Failed to generate synthetic data' });
    }
  });

  // Get generation by ID
  app.get('/api/generations/:id', async (req, res) => {
    try {
      const generation = await storage.getGeneration(req.params.id);
      if (!generation) {
        return res.status(404).json({ error: 'Generation not found' });
      }

      const evaluation = await storage.getEvaluationByGeneration(generation.id);

      res.json({ generation, evaluation });
    } catch (error) {
      console.error('Get generation error:', error);
      res.status(500).json({ error: 'Failed to fetch generation' });
    }
  });

  // Get latest generation
  app.get('/api/generations/latest', async (req, res) => {
    try {
      const generation = await storage.getLatestGeneration();
      if (!generation) {
        return res.status(404).json({ error: 'No generations found' });
      }

      const evaluation = await storage.getEvaluationByGeneration(generation.id);

      res.json({ generation, evaluation });
    } catch (error) {
      console.error('Get latest generation error:', error);
      res.status(500).json({ error: 'Failed to fetch latest generation' });
    }
  });

  // Download synthetic data
  app.get('/api/download/:id', async (req, res) => {
    try {
      const generation = await storage.getGeneration(req.params.id);
      if (!generation) {
        return res.status(404).json({ error: 'Generation not found' });
      }

      if (!generation.syntheticData) {
        return res.status(404).json({ error: 'Synthetic data not available' });
      }

      const dataset = await storage.getDataset(generation.datasetId);
      const filename = `synthetic_${dataset?.name || 'data'}_${generation.id}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(generation.syntheticData);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to download synthetic data' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
