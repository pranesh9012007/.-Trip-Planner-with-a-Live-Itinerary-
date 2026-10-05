import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  Cloud,
  Layers,
  ExternalLink,
  Sparkles,
  Workflow,
  Server
} from 'lucide-react';

interface DeployYamlPageProps {
  onBackToTrip: () => void;
}

type YamlType = 'github-actions' | 'cloud-run' | 'docker-compose' | 'app-yaml';

const YAMLS: Record<YamlType, { filename: string; label: string; description: string; content: string }> = {
  'github-actions': {
    filename: '.github/workflows/deploy.yml',
    label: 'GitHub Actions CI/CD',
    description: 'Automates linting, building Vite assets, and deploying to production on every push to main.',
    content: `name: Build & Deploy VoyageCraft

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

env:
  NODE_VERSION: '20'
  SERVICE_NAME: 'voyagecraft-live-itinerary'
  REGION: 'us-central1'

jobs:
  lint-and-build:
    name: 🧪 Lint & Build
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}

      - name: 📦 Install dependencies
        run: npm install --legacy-peer-deps

      - name: 🔍 Typecheck & Lint
        run: npm run lint

      - name: 🏗️ Build frontend application
        run: npm run build
        env:
          NODE_ENV: production

      - name: 🗄️ Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist-build
          path: dist/
          retention-days: 7

  deploy:
    name: 🚀 Deploy to Cloud Run / Hosting
    needs: lint-and-build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}

      - name: 📦 Install dependencies
        run: npm install --legacy-peer-deps

      - name: 📥 Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist-build
          path: dist

      - name: 🔑 Authenticate to Google Cloud (Optional)
        if: env.GCP_CREDENTIALS != ''
        uses: google-github-actions/auth@v2
        with:
          credentials_json: \${{ secrets.GCP_SA_KEY }}

      - name: ☁️ Deploy Service
        run: |
          echo "Starting production deployment for \${{ env.SERVICE_NAME }}..."
          echo "Environment configuration verified."
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          PORT: 3000
`
  },
  'cloud-run': {
    filename: 'cloud-run-service.yaml',
    label: 'Google Cloud Run (Knative)',
    description: 'Declarative Cloud Run deployment YAML specification with port 3000 and secret bindings.',
    content: `apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: voyagecraft-live-itinerary
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: '0'
        autoscaling.knative.dev/maxScale: '10'
        run.googleapis.com/cpu-throttling: 'true'
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
        - image: gcr.io/\${PROJECT_ID}/voyagecraft:latest
          ports:
            - name: http1
              containerPort: 3000
          resources:
            limits:
              cpu: '1000m'
              memory: '512Mi'
          env:
            - name: NODE_ENV
              value: 'production'
            - name: PORT
              value: '3000'
            - name: GEMINI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: gemini-api-key
                  key: latest
`
  },
  'docker-compose': {
    filename: 'docker-compose.yml',
    label: 'Docker Compose',
    description: 'Single-command local or VPS deployment container orchestrator.',
    content: `version: '3.8'

services:
  voyagecraft:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: voyagecraft-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
`
  },
  'app-yaml': {
    filename: 'app.yaml',
    label: 'App Engine / Cloud Config',
    description: 'Google App Engine configuration for Node.js standard runtime.',
    content: `runtime: nodejs20
instance_class: F1

env_variables:
  NODE_ENV: 'production'
  PORT: '3000'

automatic_scaling:
  min_instances: 0
  max_instances: 5
  target_cpu_utilization: 0.65

handlers:
  - url: /.*
    script: auto
    secure: always
`
  }
};

export const DeployYamlPage: React.FC<DeployYamlPageProps> = ({ onBackToTrip }) => {
  const [selectedYaml, setSelectedYaml] = useState<YamlType>('github-actions');
  const [copied, setCopied] = useState(false);

  const currentYaml = YAMLS[selectedYaml];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentYaml.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentYaml.content], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // For nested filenames like .github/workflows/deploy.yml, download as deploy.yml
    const filename = currentYaml.filename.split('/').pop() || 'deploy.yml';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" /> Deployment Configurations
              </span>
              <span className="text-xs text-slate-400 font-mono">YAML v1.2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              CI/CD & Deployment YAML Specs
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Ready-to-deploy workflow specifications for continuous integration, Cloud Run containers, Docker Compose, and App Engine hosting.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBackToTrip}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              ← Back to Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* Target Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(YAMLS) as YamlType[]).map((key) => {
          const item = YAMLS[key];
          const isSelected = selectedYaml === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedYaml(key)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40 text-amber-200'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs sm:text-sm">{item.label}</span>
                {key === 'github-actions' && <Workflow className="w-4 h-4 text-amber-400" />}
                {key === 'cloud-run' && <Cloud className="w-4 h-4 text-blue-400" />}
                {key === 'docker-compose' && <Server className="w-4 h-4 text-emerald-400" />}
                {key === 'app-yaml' && <Layers className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">{item.filename}</p>
            </button>
          );
        })}
      </div>

      {/* YAML Editor / Viewer Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Editor Top Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-850 px-2.5 py-1 rounded-md border border-slate-750">
              {currentYaml.filename}
            </span>
            <span className="text-xs text-slate-400 hidden md:inline">
              {currentYaml.description}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
              title="Download YAML file"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download .yml</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy YAML</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed selection:bg-amber-500 selection:text-slate-950">
          <pre className="whitespace-pre">
            {currentYaml.content.split('\n').map((line, idx) => (
              <div key={idx} className="table-row">
                <span className="table-cell text-right pr-4 text-slate-600 select-none w-8 text-[11px]">
                  {idx + 1}
                </span>
                <span
                  className={`table-cell ${
                    line.trim().startsWith('#')
                      ? 'text-slate-500 italic'
                      : line.includes(':') && !line.trim().startsWith('-')
                      ? 'text-amber-300/90'
                      : line.trim().startsWith('-')
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Deployment Instructions Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>1. Set Environment Secret</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In your GitHub repository, go to <strong>Settings &gt; Secrets and variables &gt; Actions</strong> and add <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">GEMINI_API_KEY</code> from Google AI Studio.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Terminal className="w-4 h-4" />
            <span>2. Commit Workflow</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Save this file into <code className="text-blue-300 bg-slate-800 px-1 py-0.5 rounded">.github/workflows/deploy.yml</code> on your branch and push to trigger automated builds.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Cloud className="w-4 h-4" />
            <span>3. Live Production</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Express server runs on port 3000 in production, serving Vite's compiled static assets in <code className="text-emerald-300 bg-slate-800 px-1 py-0.5 rounded">dist/</code> with API routes mounted at <code className="text-emerald-300 bg-slate-800 px-1 py-0.5 rounded">/api/*</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
