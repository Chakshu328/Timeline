import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Users } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Modern App</h1>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Home</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
              <Button variant="default">Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Build Something Amazing
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Create beautiful, modern applications with our cutting-edge tools and intuitive design system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Building
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us</h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the features that make our platform the perfect choice for your next project.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>
                Intuitive interface designed for developers of all skill levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Get started in minutes with our comprehensive documentation and helpful community support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>High Performance</CardTitle>
              <CardDescription>
                Optimized for speed and efficiency in every aspect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Experience lightning-fast performance with our modern architecture and optimized workflows.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Join thousands of developers building the future.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Be part of a vibrant community that shares knowledge, resources, and innovative solutions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-slate-800 py-4">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-slate-400">
              AI vibe coded development by{" "}
              <a 
                href="https://biela.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Biela.dev
              </a>
              , powered by{" "}
              <a 
                href="https://teachmecode.ae/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                TeachMeCode® Institute
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
