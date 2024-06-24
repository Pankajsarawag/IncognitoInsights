import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Container,
    Link,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Your verification code is here!</Preview>
            <Container style={styles.container}>
                <Section style={styles.section}>
                    <Row>
                        <Heading as="h1" style={styles.heading}>Welcome, {username},</Heading>
                    </Row>
                    <Row>
                        <Text style={styles.text}>
                            Thank you for signing up with Incognito Insights!
                        </Text>
                    </Row>
                    <Row>
                        <Text style={styles.text}>
                        Please use the following verification code to complete your registration:
                        </Text>
                    </Row>
                    <Row style={styles.codeRow}>
                        <Text style={styles.code}>{otp}</Text>
                    </Row>
                    <Row>
                        <Text style={styles.text}>
                            If you didn't request this code, please ignore this email. If you have any questions, feel free to <Link href="mailto:pankajsarawag2@gmail.com" style={styles.link}>contact us</Link>.
                        </Text>
                    </Row>
                    <Row>
                        <Text style={styles.signature}>Best regards,<br/>The Incognito Insights Team</Text>
                    </Row>
                </Section>
            </Container>
        </Html>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        fontFamily: 'Roboto, Verdana, sans-serif',
    },
    section: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '24px',
        color: '#333333',
        marginBottom: '20px',
    },
    text: {
        fontSize: '16px',
        color: '#555555',
        lineHeight: '1.5',
        marginBottom: '20px',
    },
    codeRow: {
        textAlign: 'center' as const,
        marginBottom: '20px',
    },
    code: {
        fontSize: '32px',
        color: 'blue',
        fontWeight: 'bold',
    },
    link: {
        color: '#1a0dab',
        textDecoration: 'none',
    },
    signature: {
        fontSize: '16px',
        color: '#555555',
        lineHeight: '1.5',
        marginTop: '20px',
    },
};
