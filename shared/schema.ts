import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Datasets table - stores uploaded CSV files
export const datasets = pgTable("datasets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  originalFilename: text("original_filename").notNull(),
  rowCount: integer("row_count").notNull(),
  columnCount: integer("column_count").notNull(),
  columns: jsonb("columns").notNull().$type<{
    name: string;
    type: 'numeric' | 'categorical';
    nullCount: number;
  }[]>(),
  fileData: text("file_data").notNull(), // Store CSV as text
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Synthetic data generations table
export const generations = pgTable("generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  datasetId: varchar("dataset_id").notNull().references(() => datasets.id, { onDelete: 'cascade' }),
  modelType: text("model_type").notNull().$type<'ctgan' | 'copula'>(),
  status: text("status").notNull().$type<'pending' | 'processing' | 'completed' | 'failed'>().default('pending'),
  parameters: jsonb("parameters").notNull().$type<{
    epochs?: number;
    batchSize?: number;
    privacyLevel?: number;
  }>(),
  syntheticData: text("synthetic_data"), // Generated CSV data
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
});

// Evaluation results table
export const evaluations = pgTable("evaluations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  generationId: varchar("generation_id").notNull().references(() => generations.id, { onDelete: 'cascade' }),
  privacyScore: real("privacy_score"),
  utilityScore: real("utility_score"),
  ksTestScore: real("ks_test_score"),
  correlationDistance: real("correlation_distance"),
  statisticalMetrics: jsonb("statistical_metrics").$type<{
    originalMean?: Record<string, number>;
    syntheticMean?: Record<string, number>;
    originalStd?: Record<string, number>;
    syntheticStd?: Record<string, number>;
  }>(),
  distributionData: jsonb("distribution_data").$type<{
    column: string;
    originalDist: number[];
    syntheticDist: number[];
    bins: number[];
  }[]>(),
  correlationData: jsonb("correlation_data").$type<{
    originalCorr: number[][];
    syntheticCorr: number[][];
    columnNames: string[];
  }>(),
  evaluatedAt: timestamp("evaluated_at").notNull().defaultNow(),
});

// Relations
export const datasetsRelations = relations(datasets, ({ many }) => ({
  generations: many(generations),
}));

export const generationsRelations = relations(generations, ({ one, many }) => ({
  dataset: one(datasets, {
    fields: [generations.datasetId],
    references: [datasets.id],
  }),
  evaluation: many(evaluations),
}));

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  generation: one(generations, {
    fields: [evaluations.generationId],
    references: [generations.id],
  }),
}));

// Insert schemas
export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  uploadedAt: true,
});

export const insertGenerationSchema = createInsertSchema(generations).omit({
  id: true,
  generatedAt: true,
  completedAt: true,
});

export const insertEvaluationSchema = createInsertSchema(evaluations).omit({
  id: true,
  evaluatedAt: true,
});

// Types
export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;

export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = z.infer<typeof insertGenerationSchema>;

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;

// Additional types for frontend
export type ModelType = 'ctgan' | 'copula';
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ColumnInfo = {
  name: string;
  type: 'numeric' | 'categorical';
  nullCount: number;
};

export type ModelParameters = {
  epochs?: number;
  batchSize?: number;
  privacyLevel?: number;
};
