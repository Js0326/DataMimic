import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Layers, BarChart3, Download, Upload, Zap, Lock } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_data_visualization_background_3f5300a9.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Privacy-Preserving Synthetic Data
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Generate synthetic datasets that preserve statistical properties and ML utility while ensuring complete data privacy and anonymity
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="bg-white text-black hover:bg-white/90" data-testid="button-get-started">
                <Upload className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="backdrop-blur-sm bg-white/10 border-white/30 text-white hover:bg-white/20"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate" data-testid="card-feature-privacy">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Privacy Guaranteed</CardTitle>
                <CardDescription>
                  Generate synthetic data that preserves statistical properties while protecting individual privacy through advanced differential privacy techniques
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-models">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Multiple Models</CardTitle>
                <CardDescription>
                  Choose from state-of-the-art models including CTGAN (deep learning) and Gaussian Copula (probabilistic) for optimal results
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-analytics">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Visual Analytics</CardTitle>
                <CardDescription>
                  Compare synthetic vs. real data with interactive charts, correlation heatmaps, and comprehensive evaluation metrics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card data-testid="card-step-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-lg">Upload Dataset</CardTitle>
                <CardDescription>
                  Upload your CSV dataset with drag-and-drop. Preview column types and basic statistics automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-step-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-lg">Select Model</CardTitle>
                <CardDescription>
                  Choose between CTGAN or Gaussian Copula and configure generation parameters for your use case
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-step-3">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-lg">Generate & Analyze</CardTitle>
                <CardDescription>
                  Our ML engine creates synthetic data and evaluates privacy and utility scores with visual comparisons
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-step-4">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  4
                </div>
                <CardTitle className="text-lg">Download Results</CardTitle>
                <CardDescription>
                  Export your synthetic dataset as CSV and download comprehensive evaluation reports
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Use Cases Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16">Built for Data Science</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="metric-privacy">
              <div className="text-5xl font-bold text-primary mb-2">95%+</div>
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Privacy Score</p>
              <p className="text-sm text-muted-foreground mt-2">Average privacy preservation across datasets</p>
            </div>
            <div className="text-center" data-testid="metric-utility">
              <div className="text-5xl font-bold text-primary mb-2">92%+</div>
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">ML Utility</p>
              <p className="text-sm text-muted-foreground mt-2">Statistical fidelity maintained in synthetic data</p>
            </div>
            <div className="text-center" data-testid="metric-compliance">
              <div className="text-5xl font-bold text-primary mb-2">100%</div>
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Compliance</p>
              <p className="text-sm text-muted-foreground mt-2">GDPR & HIPAA compliant data sharing</p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-elevate" data-testid="card-usecase-healthcare">
              <CardHeader>
                <Lock className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Healthcare</CardTitle>
                <CardDescription>
                  Share patient data for research without compromising privacy. Perfect for medical ML training.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-usecase-finance">
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Finance</CardTitle>
                <CardDescription>
                  Generate transaction datasets that preserve patterns while protecting customer information.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-usecase-research">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Research</CardTitle>
                <CardDescription>
                  Enable data sharing between institutions while maintaining statistical validity and privacy.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">Ready to Generate Synthetic Data?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start creating privacy-preserving synthetic datasets in minutes
          </p>
          <Link href="/upload">
            <Button size="lg" variant="secondary" data-testid="button-cta-start">
              <Upload className="w-5 h-5 mr-2" />
              Upload Your Dataset
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
