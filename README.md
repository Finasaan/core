# Finasaan Core Frontend Application

This is the main frontend application for Finasaan, built with Next.js and deployed as a Cloudflare Worker. It provides a modern, responsive interface for financial services and integrates with the Spine API using Service bindings for efficient Worker-to-Worker communication.

## Features

- **Server-Side Components**: Utilizes Next.js App Router for optimal performance
- **Service Bindings**: Uses Cloudflare Service bindings for zero-latency Worker-to-Worker communication
- **Financial Tips Integration**: Fetches and displays financial advice from the Spine API
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Cloudflare Workers**: Optimized for edge deployment
- **Hybrid Communication**: Service bindings in production, HTTP fallback for local development

## Project Structure

```
core/
├── app/
│   ├── page.tsx          # Main landing page
│   ├── demo/page.tsx     # Demo page showcasing API integration
│   └── layout.tsx        # Root layout component
├── components/
│   ├── financial-tips.tsx # Server-side component that calls Spine API
│   └── ui/               # Reusable UI components
└── lib/
    └── utils.ts          # Utility functions
```

## Local Development

### Prerequisites

- Node.js version 24+ (use `nvm use 24`)
- npm or yarn
- Wrangler CLI
- Running Spine API (see spine/README.md)

### Setup

1. Install dependencies:

```bash
nvm use 24
npm install
```

2. Start the development server:

```bash
npx wrangler dev
```

The application will be available on a random port (e.g., `http://localhost:35349`). Wrangler will display the actual port in the terminal output.

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: Override the default spine API URL for local development
SPINE_API_URL=http://localhost:8787
```

### Testing the Integration

1. Ensure the Spine API is running with `npx wrangler dev`
2. Visit the Core frontend URL (displayed in terminal) and navigate to `/demo`
3. The Service bindings will automatically connect when both workers are running

## Running Both Applications Locally

To test the complete integration:

1. **Terminal 1** (Spine API):

```bash
cd spine
nvm use 24
npx wrangler dev
```

2. **Terminal 2** (Core Frontend):

```bash
cd core
nvm use 24
npx wrangler dev
```

3. **Test the integration**:
   - Visit the Core frontend URL `/demo` to see financial tips
   - Service bindings will show as `[connected]` when both workers are running
   - For HTTP fallback testing, you can still use the specific ports

## Service Bindings Integration

The application uses Cloudflare Service bindings for efficient Worker-to-Worker communication:

### Configuration

The `wrangler.jsonc` file declares a Service binding to the Spine API:

```json
{
  "services": [
    {
      "binding": "SPINE",
      "service": "spine"
    }
  ]
}
```

### Service Binding Status

When running `npx wrangler dev`, you'll see the Service binding status:

```
Your Worker has access to the following bindings:
Binding                             Resource                  Mode
env.SPINE (spine)                   Worker                    local [connected]
```

- `[connected]` - Spine worker is running and accessible
- `[not connected]` - Spine worker is not running

### Financial Tips Component

- Located at `components/financial-tips.tsx`
- **Production**: Uses Service binding `env.SPINE.fetch()` for zero-latency communication
- **Development**: Falls back to HTTP fetch to `http://localhost:8787`
- Handles errors gracefully with fallback UI
- Renders financial advice with categories and priorities

### Communication Flow

1. **Service Binding** (Production):

   ```javascript
   const request = new Request("https://spine.internal/api/financial-tips", {
     method: "GET",
     headers: { "Content-Type": "application/json" },
   });
   const response = await env.SPINE.fetch(request);
   ```

2. **HTTP Fallback** (Development):

   ```javascript
   const response = await fetch("http://localhost:8787/api/financial-tips");
   ```

## Pages

- **Landing Page** (`/`): Coming soon page with branding
- **Demo Page** (`/demo`): Showcases the financial tips integration with the Spine API

## Deployment

Deploy to Cloudflare Workers:

```bash
npx wrangler deploy
```

**Important**: The Spine worker must be deployed **before** the Core worker, since Core declares a Service binding to Spine.

## Technical Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Deployment**: Cloudflare Workers
- **API Integration**: Service bindings with HTTP fallback

## Service Bindings Benefits

- **Zero Latency**: Direct Worker-to-Worker communication
- **Security**: Internal communication, no public URLs needed
- **Performance**: Both Workers can run on the same thread
- **Cost Effective**: No additional network overhead
- **Smart Placement**: Automatic optimal location placement

## Troubleshooting

### Common Issues

1. **Service binding not connected**: Ensure the Spine worker is running with `npx wrangler dev`
2. **Random ports**: Both workers will use random ports when using `npx wrangler dev`
3. **Deployment order**: Deploy Spine worker first, then Core worker

### Testing Service Bindings Locally

When running `npx wrangler dev`, you'll see:

```
Your Worker has access to the following bindings:
- Services:
  - SPINE: spine [connected/not connected]
```

The Service bindings automatically handle communication between workers regardless of the random ports assigned.

### Testing API Connection

```bash
# Test if Spine API is accessible (replace port with actual port from terminal)
curl http://localhost:40345/api/health

# Test financial tips endpoint
curl http://localhost:40345/api/financial-tips
```

## Learn More

- [Cloudflare Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/service-bindings/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

## Contributing

1. Ensure both Spine API and Core app are running locally
2. Test the integration at `/demo` before submitting changes
3. Remember that local development uses HTTP fallback, production uses Service bindings
4. Follow the existing code patterns and TypeScript conventions
