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

interface ForgotPasswordEmailProps {
    username: string;
    resetUrl:string;
}

export default function ForgotPasswordEmail({ username,resetUrl }: ForgotPasswordEmailProps) {

    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Forgot Password Email</title>
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
            <Preview>Reset your password</Preview>
            <Container style={styles.container}>
                <Section style={styles.section}>
                    <Row>
                        <Heading as="h1" style={styles.heading}>Reset Your Password</Heading>
                    </Row>
                    <Row>
                        <Text style={styles.text}>
                            We received a request to reset your password. Please click the following link to reset your password:
                        </Text>
                    </Row>
                    <Row>
                        <Link href={`${resetUrl}`} style={styles.link}>Reset Password</Link>
                    </Row>
                    <Row>
                        <Text style={styles.text}>
                            If you can't click the link above, copy and paste the following URL into your browser:
                        </Text>
                    </Row>
                    <Row>
                        <Text style={styles.text}>{`${resetUrl}`}</Text>
                    </Row>
                    <Row>
                        <Text style={styles.text}>
                            If you didn't request a password reset, please ignore this email. If you have any questions, feel free to <Link href="mailto:pankajsarawag2@gmail.com" style={styles.link}>contact us</Link>.
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
