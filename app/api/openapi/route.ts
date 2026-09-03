export async function GET() {
  return Response.json({ openapi: '3.0.3', info: { title: '1Fi EMI Marketplace API', version: '2.0.0' }, paths: {
    '/api/products': { get: { summary: 'List products with filters' } },
    '/api/products/{id}': { get: { summary: 'Get product by ID or slug' } },
    '/api/products/{id}/emi-plans': { get: { summary: 'Get EMI plans for a product/variant' } },
    '/api/applications': { post: { summary: 'Create EMI application' } },
    '/api/applications/{id}': { get: { summary: 'Get application status' } },
    '/api/applications/kyc': { post: { summary: 'Submit KYC details; only masked document suffixes are persisted' } },
    '/api/health': { get: { summary: 'Database health check' } },
  } });
}
