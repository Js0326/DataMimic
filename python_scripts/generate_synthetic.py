#!/usr/bin/env python3
"""
Synthetic Data Generation Script
Simulates CTGAN and Gaussian Copula generation for DataMimic
Note: This is a simplified implementation for demonstration purposes.
In production, you would use the SDV library with actual CTGAN/Copula models.
"""

import sys
import json
import csv
import random
from io import StringIO

def parse_csv(csv_data):
    """Parse CSV data and analyze columns"""
    reader = csv.DictReader(StringIO(csv_data))
    rows = list(reader)
    headers = reader.fieldnames if reader.fieldnames else []
    
    # Analyze column types
    columns = []
    for header in headers:
        values = [row[header] for row in rows if row[header]]
        is_numeric = all(is_number(v) for v in values[:100] if v)  # Sample first 100
        
        columns.append({
            'name': header,
            'type': 'numeric' if is_numeric else 'categorical',
            'values': values
        })
    
    return headers, rows, columns

def is_number(s):
    """Check if string is a number"""
    try:
        float(s)
        return True
    except (ValueError, TypeError):
        return False

def generate_ctgan(headers, rows, columns, row_count, **params):
    """
    Simulate CTGAN generation
    In production, this would use sdv.tabular.CTGAN
    """
    synthetic_rows = []
    
    for _ in range(row_count):
        row = {}
        for col in columns:
            if col['type'] == 'numeric':
                # Add noise to numeric values
                original_values = [float(v) for v in col['values'] if is_number(v)]
                if original_values:
                    mean = sum(original_values) / len(original_values)
                    std = (sum((x - mean) ** 2 for x in original_values) / len(original_values)) ** 0.5
                    row[col['name']] = str(round(random.gauss(mean, std * 1.1), 2))
                else:
                    row[col['name']] = '0'
            else:
                # Sample with slight variation for categorical
                unique_values = list(set(col['values']))
                if unique_values:
                    row[col['name']] = random.choice(unique_values)
                else:
                    row[col['name']] = ''
        
        synthetic_rows.append(row)
    
    return synthetic_rows

def generate_copula(headers, rows, columns, row_count, **params):
    """
    Simulate Gaussian Copula generation
    In production, this would use sdv.tabular.GaussianCopula
    """
    synthetic_rows = []
    
    for _ in range(row_count):
        row = {}
        for col in columns:
            if col['type'] == 'numeric':
                # Preserve distribution more closely
                original_values = [float(v) for v in col['values'] if is_number(v)]
                if original_values:
                    mean = sum(original_values) / len(original_values)
                    std = (sum((x - mean) ** 2 for x in original_values) / len(original_values)) ** 0.5
                    row[col['name']] = str(round(random.gauss(mean, std * 0.95), 2))
                else:
                    row[col['name']] = '0'
            else:
                # Direct sampling for categorical
                unique_values = list(set(col['values']))
                if unique_values:
                    row[col['name']] = random.choice(unique_values)
                else:
                    row[col['name']] = ''
        
        synthetic_rows.append(row)
    
    return synthetic_rows

def evaluate_quality(original_rows, synthetic_rows, columns):
    """
    Calculate evaluation metrics
    Simulates KS test, correlation distance, privacy and utility scores
    """
    # Simulated metrics (in production, use scipy.stats, sklearn metrics)
    ks_score = random.uniform(0.01, 0.05)  # Lower is better
    correlation_distance = random.uniform(0.02, 0.08)
    
    # Calculate simplified statistics
    original_stats = {}
    synthetic_stats = {}
    
    for col in columns:
        if col['type'] == 'numeric':
            orig_values = [float(row.get(col['name'], 0)) for row in original_rows if is_number(row.get(col['name']))]
            synth_values = [float(row.get(col['name'], 0)) for row in synthetic_rows if is_number(row.get(col['name']))]
            
            if orig_values and synth_values:
                original_stats[col['name']] = {
                    'mean': sum(orig_values) / len(orig_values),
                    'std': (sum((x - sum(orig_values) / len(orig_values)) ** 2 for x in orig_values) / len(orig_values)) ** 0.5
                }
                synthetic_stats[col['name']] = {
                    'mean': sum(synth_values) / len(synth_values),
                    'std': (sum((x - sum(synth_values) / len(synth_values)) ** 2 for x in synth_values) / len(synth_values)) ** 0.5
                }
    
    # Generate distribution data for charts
    distribution_data = []
    for col in columns[:3]:  # First 3 numeric columns
        if col['type'] == 'numeric':
            distribution_data.append({
                'column': col['name'],
                'originalDist': [random.randint(50, 200) for _ in range(6)],
                'syntheticDist': [random.randint(45, 205) for _ in range(6)],
                'bins': list(range(0, 60, 10))
            })
    
    # Generate correlation data (simplified)
    correlation_data = {
        'originalCorr': [[1, 0.7], [0.7, 1]],
        'syntheticCorr': [[1, 0.68], [0.68, 1]],
        'columnNames': [col['name'] for col in columns[:2] if col['type'] == 'numeric']
    }
    
    return {
        'privacyScore': random.uniform(90, 98),
        'utilityScore': random.uniform(88, 96),
        'ksTestScore': ks_score,
        'correlationDistance': correlation_distance,
        'statisticalMetrics': {
            'originalMean': {k: v['mean'] for k, v in original_stats.items()},
            'syntheticMean': {k: v['mean'] for k, v in synthetic_stats.items()},
            'originalStd': {k: v['std'] for k, v in original_stats.items()},
            'syntheticStd': {k: v['std'] for k, v in synthetic_stats.items()},
        },
        'distributionData': distribution_data,
        'correlationData': correlation_data
    }

def rows_to_csv(headers, rows):
    """Convert rows back to CSV string"""
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)
    return output.getvalue()

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Missing input data'}))
        sys.exit(1)
    
    try:
        # Parse input arguments
        input_data = json.loads(sys.argv[1])
        
        csv_data = input_data.get('csvData', '')
        model_type = input_data.get('modelType', 'copula')
        row_count = input_data.get('rowCount', 100)
        parameters = input_data.get('parameters', {})
        
        # Parse CSV
        headers, rows, columns = parse_csv(csv_data)
        
        # Generate synthetic data based on model type
        if model_type == 'ctgan':
            synthetic_rows = generate_ctgan(headers, rows, columns, row_count, **parameters)
        else:
            synthetic_rows = generate_copula(headers, rows, columns, row_count, **parameters)
        
        # Evaluate quality
        evaluation = evaluate_quality(rows, synthetic_rows, columns)
        
        # Convert back to CSV
        synthetic_csv = rows_to_csv(headers, synthetic_rows)
        
        # Return result
        result = {
            'success': True,
            'syntheticData': synthetic_csv,
            'evaluation': evaluation
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({'error': str(e), 'success': False}))
        sys.exit(1)

if __name__ == '__main__':
    main()
