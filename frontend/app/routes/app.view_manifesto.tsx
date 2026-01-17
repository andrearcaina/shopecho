import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
    Page,
    Layout,
    Card,
    Button,
    BlockStack,
    Text,
    Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import ReactMarkdown from "react-markdown";

export default function Index() {
    const fetcher = useFetcher<any>();
    const isLoading = fetcher.state !== "idle";
    const data = fetcher.data;

    useEffect(() => {
    if (data?.status === "success") {
        shopify.toast.show("Manifesto loaded successfully");
    } else if (data?.status === "error") {
        shopify.toast.show("Failed to fetch manifesto", { isError: true });
    }
    }, [data]);

    return (
        <Page>
            <TitleBar title="AGENT AI SYSTEM" />
            
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="500">
                            <Text as="h2" variant="headingLg">
                                Agent Status: <span style={{ color: "green" }}>Working</span>
                            </Text>

                            <Text as="p">
                                The Agent is ready to retrieve the current{" "}
                                <strong>BRAND MANIFESTO</strong>.
                            </Text>

                            {data?.status === "error" && (
                            <Banner tone="critical" title="Connection Failed">
                                <p>
                                    Could not connect to Python. Check your{" "}
                                    <code>uvicorn</code> console.
                                </p>
                            </Banner>
                            )}

                            <fetcher.Form method="post" action="/api/view_manifesto">
                                <Button
                                    submit
                                    variant="primary"
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Fetching..." : "View Manifesto"}
                                </Button>
                            </fetcher.Form>
                        </BlockStack>
                    </Card>
                </Layout.Section>

                {data?.manifesto?.manifesto && (
                    <Layout.Section>
                        <Card>
                            <BlockStack gap="300">

                                <ReactMarkdown
                                    components={{
                                    h1: ({ children }) => (
                                        <Text as="h1" variant="headingXl">
                                        {children}
                                        </Text>
                                    ),
                                    h2: ({ children }) => (
                                        <Text as="h2" variant="headingLg">
                                        {children}
                                        </Text>
                                    ),
                                    p: ({ children }) => (
                                        <Text as="p" variant="bodyMd">
                                        {children}
                                        </Text>
                                    ),
                                    }}
                                >
                                    {data.manifesto.manifesto}
                                </ReactMarkdown>
                            </BlockStack>
                        </Card>
                        </Layout.Section>
                    )}
            </Layout>
        </Page>
    );
}
