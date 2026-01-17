import { Button, Card, Layout, Page, Text, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function Index() {
  const runScan = () => {
    // This is where we will hook up Python later
    console.log("Calling Agent...");
    shopify.toast.show("Agent Activation Signal Sent!"); 
  };

  return (
    <Page>
      <TitleBar title="AGENT AI SYSTEM" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingLg">
                Agent Status: <span style={{color: "green"}}>Active & Watching</span>
              </Text>
              
              <Text as="p">
                Your AI Co-founder is currently monitoring the store for 
                identity violations and trend opportunities.
              </Text>
              
              <Button variant="primary" onClick={runScan}>
                Run Identity Vibe Check
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingMd">Memory (BackBoard)</Text>
              <Text as="p" tone="subdued">Visual Style: Cyber-Y2K</Text>
              <Text as="p" tone="subdued">Tone: Sassy</Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}