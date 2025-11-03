# DataMimic Design Guidelines

## Design Approach

**Selected System**: Carbon Design System with data science tool adaptations  
**Justification**: DataMimic is a utility-focused, information-dense application where clarity, efficiency, and data presentation are paramount. Carbon Design System excels at enterprise data applications with robust component patterns for tables, charts, and complex workflows.

**Core Principles**:
- Data-first clarity: Information hierarchy that prioritizes data visibility
- Professional efficiency: Streamlined workflows for dataset upload → generation → analysis
- Scientific credibility: Clean, authoritative aesthetic appropriate for ML/data science context

---

## Typography System

**Primary Font**: IBM Plex Sans (via Google Fonts CDN)  
**Monospace Font**: IBM Plex Mono (for data tables, code snippets, technical metrics)

**Type Scale**:
- Page Headers: text-4xl font-semibold (36px)
- Section Headers: text-2xl font-semibold (24px)
- Card Headers: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Metric Labels: text-sm font-medium uppercase tracking-wide (14px)
- Data Tables: text-sm font-mono (14px monospace)
- Caption/Help Text: text-xs (12px)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 24** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-8, space-y-12
- Card margins: m-4, m-6
- Grid gaps: gap-4, gap-6, gap-8

**Container Strategy**:
- Application shell: Full viewport with fixed sidebar (w-64) + main content area
- Content max-width: max-w-7xl mx-auto
- Dashboard cards: Grid layouts (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Data tables: Full container width with horizontal scroll if needed

**Page Layouts**:

1. **Application Shell** (all pages except home):
   - Fixed left sidebar navigation (w-64, h-screen)
   - Top header bar (h-16) with breadcrumbs and user actions
   - Main content area with generous padding (p-8 lg:p-12)

2. **Home/Landing Page**:
   - Hero section (h-[600px]) with centered content
   - Feature grid (3 columns on desktop, stacked mobile)
   - "How It Works" section with 4-step process (numbered cards)
   - Trust indicators section (metrics, use cases)
   - CTA section for getting started

3. **Upload Page**:
   - Large dropzone area (min-h-[400px]) with drag-and-drop
   - File upload button (alternative to drag-drop)
   - Data preview table (when file uploaded) with fixed header
   - Column type indicators (badges for numeric/categorical)
   - Basic statistics summary (row count, column count, missing values)

4. **Model Selection Page**:
   - Model cards in 2-column grid layout
   - Each card shows: model name, description, use case, pros/cons
   - Advanced parameters in expandable accordion sections
   - Configuration form with labeled inputs and help text
   - Progress indicator showing step 2 of 4

5. **Results Dashboard**:
   - Metrics overview cards at top (4-column grid): Total Rows, Columns, Privacy Score, Utility Score
   - Chart section with tabs: Distributions, Correlations, Comparisons
   - Side-by-side data table comparison (original sample vs synthetic sample)
   - Evaluation metrics table with expandable detail rows
   - Download action panel (sticky bottom or top-right)

---

## Component Library

### Navigation & Shell

**Sidebar Navigation**:
- Brand logo at top (h-16, px-4)
- Navigation items with icons from Heroicons (h-12, px-4, hover state)
- Active state with subtle left border accent (border-l-4)
- Grouped sections with small header labels

**Top Header**:
- Breadcrumb navigation (text-sm with / separators)
- Page title (text-2xl font-semibold)
- Action buttons aligned right (primary + secondary)

### Forms & Inputs

**File Upload Dropzone**:
- Dashed border (border-2 border-dashed rounded-lg)
- Large icon (w-16 h-16 centered)
- Primary text: "Drag and drop CSV file here"
- Secondary text: "or click to browse (max 10MB)"
- Upload button as alternative

**Input Fields**:
- Label above input (text-sm font-medium mb-2)
- Input with border (border rounded-md px-4 py-2)
- Help text below (text-xs mt-1)
- Validation states: success (green border), error (red border + error message)

**Model Selection Cards**:
- Cards with border and hover elevation (border rounded-lg p-6 hover:shadow-lg transition)
- Header with icon + model name
- Description paragraph
- "Select Model" button at bottom
- Radio button for selection state

**Parameter Controls**:
- Range sliders for numeric parameters (with min/max labels)
- Toggle switches for boolean options
- Number inputs with increment/decrement buttons
- Dropdown selects for categorical choices

### Data Display

**Data Tables**:
- Fixed header with sort indicators
- Alternating row backgrounds (subtle zebra striping)
- Monospace font for data cells
- Column type badges in headers (rounded pills)
- Pagination controls at bottom
- "Copy" button for individual cells

**Metrics Cards**:
- Large number display (text-4xl font-bold)
- Label above or below (text-sm uppercase tracking-wide)
- Optional trend indicator (arrow icon + percentage)
- Subtle border with rounded corners

**Charts** (using Recharts or Plotly.js):
- Distribution plots: Overlaid histograms for original vs synthetic
- Correlation heatmap: Color-coded matrix with values on hover
- Comparison charts: Side-by-side bar charts
- Consistent chart height (h-[400px])
- Legend placement below charts
- Tooltips on hover with detailed values

### Actions & Feedback

**Buttons**:
- Primary: filled with text-white (px-6 py-3 rounded-md font-medium)
- Secondary: bordered outline (border-2 px-6 py-3 rounded-md)
- Icon buttons: Square with centered icon (w-10 h-10)
- Button groups: Connected buttons with shared borders

**Progress Indicators**:
- Linear progress bar (h-2 rounded-full) for generation progress
- Percentage text below
- Stepped progress for multi-stage workflows (1→2→3→4 with connecting lines)

**Status Badges**:
- Pill-shaped (rounded-full px-3 py-1 text-xs font-medium)
- States: Processing, Complete, Error, Ready
- Icon prefix for visual reinforcement

**Toast Notifications**:
- Fixed bottom-right position
- Icon + message + close button
- Auto-dismiss after 5 seconds
- Types: Success, Error, Info, Warning

### Download Section

**Download Panel**:
- Card with clear sections
- Large "Download Synthetic Data" button (primary, full-width)
- File format options (CSV, JSON) as radio buttons
- "Download Report" secondary button
- File size and row count preview

---

## Images

**Hero Section Image**: Yes, include a large hero image
- **Placement**: Home page hero section (right side of two-column layout or as background with overlay)
- **Description**: Abstract data visualization - interconnected nodes, flowing data streams, or geometric patterns representing synthetic data generation. Should convey technology, privacy (lock/shield elements), and data transformation.
- **Treatment**: Subtle gradient overlay to ensure text readability
- **Buttons on image**: If placed over image, use backdrop-blur-sm with semi-transparent background

**Feature Section Illustrations**:
- **Model Cards**: Small icons/illustrations representing each model type (brain network for CTGAN, statistical curves for Gaussian Copula)
- **How It Works**: Simple line illustrations for each step (upload icon, gear/settings, chart, download arrow)

**Empty States**:
- Illustration for empty upload state (folder with upward arrow)
- Illustration for "no data yet" dashboard state

---

## Accessibility & Consistency

- Maintain WCAG AA contrast ratios for all text
- Form inputs: Always pair label + input + help text structure
- Focus states: Visible focus rings (ring-2 ring-offset-2) on all interactive elements
- Screen reader labels for icon-only buttons
- Skip navigation link for keyboard users
- Loading states: Always show spinner or skeleton for async operations
- Error states: Clear error messages with recovery actions

---

## Page-Specific Layouts

**Home Page Sections** (6 sections total):
1. Hero (h-[600px], two-column: left text/CTA, right illustration)
2. Key Features (3-column grid, icon + title + description cards)
3. How It Works (4-step horizontal process with numbered cards)
4. Model Overview (2-column comparison table or cards)
5. Trust & Credibility (metrics, use case examples, 3-column grid)
6. CTA Section (centered, generous padding py-24)

**Dashboard Grid System**:
- Metrics row: 4 equal columns (grid-cols-4)
- Charts section: Tabs with full-width chart containers
- Comparison section: 2-column grid for side-by-side tables
- Evaluation table: Full-width with expandable rows

---

## Animations

Use sparingly and purposefully:
- Page transitions: Simple fade-in (0.2s)
- Card hover: Subtle elevation increase
- Progress bar: Smooth width transition
- Data loading: Skeleton pulse animation
- No scroll-triggered animations
- No complex transitions that distract from data analysis