import { useEffect, useState } from "react";
import {
    Page,
    Layout,
    Card,
    Text,
    Button,
    BlockStack,
    Box,
    Badge,
    InlineGrid,
    Divider,
    Icon,
    Scrollable
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ReplayIcon, EmailIcon, CheckIcon } from "@shopify/polaris-icons";
import {
    createCampaignDraftEmail,
    createCampaignDraftVideo,
    getCampaignVideoFile,
} from "./api.campaign";
import ReactMarkdown from "react-markdown";

export default function CampaignPage() {
    const [videos, setVideos] = useState<{ file_path: string }[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>([]);
    const [emailDraft, setEmailDraft] = useState("");
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false);

    /* -------------------- VIDEO -------------------- */

    const handleGenerateVideo = async () => {
        setLoadingVideo(true);
        try {
            const result = await createCampaignDraftVideo();
            const videoList = result?.videos || result?.data?.videos;

            if (!videoList?.length) {
                shopify.toast.show("No videos returned", { isError: true });
                return;
            }

            setVideos(videoList);

            const urls = await Promise.all(
                videoList.map(async (v) => {
                    const blob = await getCampaignVideoFile(v.file_path);
                    return URL.createObjectURL(blob);
                })
            );

            setVideoUrls(urls);
            shopify.toast.show("Videos generated successfully");
        } catch (error) {
            console.error("Video Generation Error:", error);
            shopify.toast.show("Failed to generate videos", { isError: true });
        } finally {
            setLoadingVideo(false);
        }
    };

    /* Cleanup blob URLs */
    useEffect(() => {
        return () => {
            videoUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [videoUrls]);

    /* -------------------- EMAIL -------------------- */

    const handleGenerateEmail = async () => {
        setLoadingEmail(true);
        try {
            const result = await createCampaignDraftEmail();
            const content = result?.data?.email?.email_content;

            if (content) {
                setEmailDraft(content);
                shopify.toast.show("Email draft created");
            } else {
                shopify.toast.show("Email data mismatch", { isError: true });
            }
        } catch (error) {
            console.error("Email Generation Error:", error);
            shopify.toast.show("Failed to generate email", { isError: true });
        } finally {
            setLoadingEmail(false);
        }
    };

    return (
        <Page fullWidth>
            <TitleBar title="Campaign Command Center" />

            <BlockStack gap="500">
                {/* ---------------- Identity Guardrails ---------------- */}
                <Card>
                    <BlockStack gap="400">
                        <Text variant="headingMd" as="h2">Identity Guardrails</Text>
                        <InlineGrid columns={["oneThird", "twoThirds"]} gap="400">
                            <BlockStack gap="200">
                                <Badge tone="success" icon={CheckIcon}>
                                    Manifesto Active
                                </Badge>
                                <Text as="p" tone="subdued" variant="bodySm">
                                    All creative decisions are manifesto-filtered.
                                </Text>
                            </BlockStack>
                            <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                                <Text as="p" tone="subdued">
                                    <b>Current Focus:</b> Scaling hit video signals.
                                </Text>
                            </Box>
                        </InlineGrid>
                    </BlockStack>
                </Card>

                <Layout>
                    {/* ---------------- VIDEO SECTION ---------------- */}
                    <Layout.Section variant="oneHalf">
                        <Card>
                            <BlockStack gap="400">
                                <InlineGrid columns="1fr auto">
                                    <BlockStack gap="100">
                                        <InlineGrid columns="auto 1fr" gap="200">
                                            <Icon source={ReplayIcon} tone="critical" />
                                            <Text variant="headingLg" as="h3">
                                                YouTube MP4 Generation
                                            </Text>
                                        </InlineGrid>
                                        <Text as="p" tone="subdued" variant="bodySm">
                                            AI-generated short-form videos
                                        </Text>
                                    </BlockStack>
                                    <Button
                                        variant="primary"
                                        loading={loadingVideo}
                                        onClick={handleGenerateVideo}
                                    >
                                        Generate Videos
                                    </Button>
                                </InlineGrid>

                                <Divider />

                                <Box
                                    minHeight="400px"
                                    padding="400"
                                    background="bg-surface-secondary"
                                    borderRadius="200"
                                >
                                    {videoUrls.length ? (
                                        <Scrollable shadow style={{ height: "350px" }}>
                                            <BlockStack gap="400">
                                                {videoUrls.map((url, i) => (
                                                    <Card key={i}>
                                                        <video
                                                            src={url}
                                                            controls
                                                            style={{
                                                                width: "100%",
                                                                borderRadius: 8,
                                                            }}
                                                        />
                                                        <Text as="p" variant="bodySm" tone="subdued">
                                                            {videos[i]?.file_path}
                                                        </Text>
                                                    </Card>
                                                ))}
                                            </BlockStack>
                                        </Scrollable>
                                    ) : (
                                        <Text as="p" alignment="center" tone="subdued">
                                            Click generate to create videos.
                                        </Text>
                                    )}
                                </Box>
                            </BlockStack>
                        </Card>
                    </Layout.Section>

                    {/* ---------------- EMAIL SECTION ---------------- */}
                    <Layout.Section variant="oneHalf">
                        <Card>
                            <BlockStack gap="400">
                                <InlineGrid columns="1fr auto">
                                    <BlockStack gap="100">
                                        <InlineGrid columns="auto 1fr" gap="200">
                                            <Icon source={EmailIcon} tone="interactive" />
                                            <Text variant="headingLg" as="h3">
                                                Email Campaign
                                            </Text>
                                        </InlineGrid>
                                        <Text as="p" tone="subdued" variant="bodySm">
                                            Manifesto-aligned outreach
                                        </Text>
                                    </BlockStack>
                                    <Button
                                        variant="primary"
                                        loading={loadingEmail}
                                        onClick={handleGenerateEmail}
                                    >
                                        Generate Email
                                    </Button>
                                </InlineGrid>

                                <Divider />

                                <Box
                                    minHeight="400px"
                                    padding="400"
                                    background="bg-surface-secondary"
                                    borderRadius="200"
                                >
                                    {emailDraft ? (
                                        <Scrollable shadow style={{ height: "350px" }}>
                                            <div style={{ lineHeight: 1.6, fontSize: 14 }}>
                                                <ReactMarkdown>{emailDraft}</ReactMarkdown>
                                            </div>
                                        </Scrollable>
                                    ) : (
                                        <Text as="p" alignment="center" tone="subdued">
                                            Click generate to create an email draft.
                                        </Text>
                                    )}
                                </Box>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </BlockStack>
        </Page>
    );
}
