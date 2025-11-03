// Referenced from javascript_database integration blueprint
import {
  datasets,
  generations,
  evaluations,
  type Dataset,
  type InsertDataset,
  type Generation,
  type InsertGeneration,
  type Evaluation,
  type InsertEvaluation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Dataset operations
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  getDataset(id: string): Promise<Dataset | undefined>;
  getAllDatasets(): Promise<Dataset[]>;
  deleteDataset(id: string): Promise<void>;

  // Generation operations
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGeneration(id: string): Promise<Generation | undefined>;
  getGenerationsByDataset(datasetId: string): Promise<Generation[]>;
  updateGeneration(id: string, data: Partial<Generation>): Promise<Generation | undefined>;
  getLatestGeneration(): Promise<Generation | undefined>;

  // Evaluation operations
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
  getEvaluationByGeneration(generationId: string): Promise<Evaluation | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Dataset operations
  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const [dataset] = await db
      .insert(datasets)
      .values(insertDataset)
      .returning();
    return dataset;
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    const [dataset] = await db.select().from(datasets).where(eq(datasets.id, id));
    return dataset || undefined;
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return await db.select().from(datasets).orderBy(desc(datasets.uploadedAt));
  }

  async deleteDataset(id: string): Promise<void> {
    await db.delete(datasets).where(eq(datasets.id, id));
  }

  // Generation operations
  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const [generation] = await db
      .insert(generations)
      .values(insertGeneration)
      .returning();
    return generation;
  }

  async getGeneration(id: string): Promise<Generation | undefined> {
    const [generation] = await db.select().from(generations).where(eq(generations.id, id));
    return generation || undefined;
  }

  async getGenerationsByDataset(datasetId: string): Promise<Generation[]> {
    return await db
      .select()
      .from(generations)
      .where(eq(generations.datasetId, datasetId))
      .orderBy(desc(generations.generatedAt));
  }

  async updateGeneration(id: string, data: Partial<Generation>): Promise<Generation | undefined> {
    const [updated] = await db
      .update(generations)
      .set(data)
      .where(eq(generations.id, id))
      .returning();
    return updated || undefined;
  }

  async getLatestGeneration(): Promise<Generation | undefined> {
    const [generation] = await db
      .select()
      .from(generations)
      .orderBy(desc(generations.generatedAt))
      .limit(1);
    return generation || undefined;
  }

  // Evaluation operations
  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const [evaluation] = await db
      .insert(evaluations)
      .values(insertEvaluation)
      .returning();
    return evaluation;
  }

  async getEvaluationByGeneration(generationId: string): Promise<Evaluation | undefined> {
    const [evaluation] = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.generationId, generationId));
    return evaluation || undefined;
  }
}

export const storage = new DatabaseStorage();
