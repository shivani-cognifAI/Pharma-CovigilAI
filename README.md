# Documentation: Setting up GitHub Actions with Azure Static Web Apps and Key Vault

## Prerequisites

- Azure CLI installed
- Access to Azure Portal
- GitHub repository with admin access
- Azure subscription with appropriate permissions

## Step-by-Step Guide

### 1. Configure Azure App Registration for GitHub Actions

First, create or use an existing app registration and add federated credentials for GitHub Actions:

```bash
# List existing app registrations
az ad app list --query "[].{displayName:displayName, appId:appId}" -o table

# Add federated credential for GitHub Actions
az ad app federated-credential create \
  --id <APP_REGISTRATION_ID> \
  --parameters "{\"name\":\"github-actions-release-v1.7.0\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:CognifAI-solutions/Pharmacovigilence:ref:refs/heads/release-V1.7.0\",\"audiences\":[\"api://AzureADTokenExchange\"]}"

# Verify federated credentials
az ad app federated-credential list --id <APP_REGISTRATION_ID> -o table
```

### 2. Configure Key Vault Access

Grant the app registration access to Key Vault secrets:

```bash
# Add access policy to Key Vault
az keyvault set-policy \
  --name CoVigilAI-App-Demo-Vars \
  --object-id <APP_REGISTRATION_OBJECT_ID> \
  --secret-permissions get list
```

### 3. GitHub Actions Workflow Configuration

Create or update your workflow file (`.github/workflows/azure-static-web-app.yml`):

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - release-V1.7.0
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - release-V1.7.0

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          lfs: false

      - name: Azure Login
        uses: azure/login@v2
        with:
          client-id: <APP_REGISTRATION_CLIENT_ID>
          tenant-id: <TENANT_ID>
          subscription-id: <SUBSCRIPTION_ID>
          audience: api://AzureADTokenExchange

      - name: Retrieve Secrets from Azure Key Vault
        id: keyvault
        uses: azure/cli@v2
        with:
          inlineScript: |
            set -e
            api_url=$(az keyvault secret show --vault-name 'CoVigilAI-App-Demo-Vars' --name "NEXT-PUBLIC-API-BASE-URL" --query value -o tsv)
            echo "api_base_url=$api_url" >> $GITHUB_OUTPUT
            app_url=$(az keyvault secret show --vault-name 'CoVigilAI-App-Demo-Vars' --name "NEXT-PUBLIC-CURRENT-APP-BASE-URL" --query value -o tsv)
            echo "app_base_url=$app_url" >> $GITHUB_OUTPUT
            vendor_email=$(az keyvault secret show --vault-name 'CoVigilAI-App-Demo-Vars' --name "NEXT-PUBLIC-FULLTEXT-VENDOR-EMAIL" --query value -o tsv)
            echo "vendor_email=$vendor_email" >> $GITHUB_OUTPUT
            mapping_id=$(az keyvault secret show --vault-name 'CoVigilAI-App-Demo-Vars' --name "NEXT-PUBLIC-MAPPING-ID" --query value -o tsv)
            echo "mapping_id=$mapping_id" >> $GITHUB_OUTPUT

      - name: Set Environment Variables
        run: |
          echo "NEXT_PUBLIC_API_BASE_URL=${{ steps.keyvault.outputs.api_base_url }}" >> $GITHUB_ENV
          echo "NEXT_PUBLIC_CURRENT_APP_BASE_URL=${{ steps.keyvault.outputs.app_base_url }}" >> $GITHUB_ENV
          echo "NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL=${{ steps.keyvault.outputs.vendor_email }}" >> $GITHUB_ENV
          echo "NEXT_PUBLIC_MAPPING_ID=${{ steps.keyvault.outputs.mapping_id }}" >> $GITHUB_ENV

      - name: Install Dependencies
        run: npm install

      - name: Build Project
        run: npm run build

      - name: Debug Environment Variables
        run: |
          echo "NEXT_PUBLIC_API_BASE_URL is $NEXT_PUBLIC_API_BASE_URL"
          echo "NEXT_PUBLIC_CURRENT_APP_BASE_URL is $NEXT_PUBLIC_CURRENT_APP_BASE_URL"
          echo "NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL is $NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL"
          echo "NEXT_PUBLIC_MAPPING_ID is $NEXT_PUBLIC_MAPPING_ID"

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: ""
```

## Important Notes

1. **App Registration Requirements**:

   - The app registration must have the correct federated credential for your GitHub repository and branch
   - The subject in the federated credential must exactly match your repository and branch name

2. **Key Vault Configuration**:

   - Ensure the Key Vault exists and contains the required secrets
   - The app registration must have appropriate permissions (get, list) to access secrets

3. **GitHub Actions Workflow**:

   - The workflow requires `id-token: write` and `contents: read` permissions
   - Environment variables are set both at the workflow level and during the build process

4. **Troubleshooting**:
   - If you get OIDC authentication errors, verify the federated credential configuration
   - If you get Key Vault access errors, check the access policies
   - Use the debug step to verify environment variables are set correctly
