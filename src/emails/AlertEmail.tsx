import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Alert } from '@/features/trading/types';

interface AlertEmailProps {
  alert: Alert;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export const AlertEmail = ({
  alert,
  currentPrice,
  change,
  changePercent,
}: AlertEmailProps) => {
  const previewText = `Alert triggered: ${alert.symbol} ${alert.condition} ${alert.value}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Alert Triggered</Heading>
          <Section style={section}>
            <Text style={text}>
              Your alert for {alert.symbol} has been triggered:
            </Text>
            <Text style={text}>
              <strong>Condition:</strong> {alert.condition} {alert.value}
            </Text>
            <Text style={text}>
              <strong>Current Price:</strong> ${currentPrice.toFixed(2)}
            </Text>
            <Text style={text}>
              <strong>Change:</strong>{' '}
              <span
                style={{
                  color: change >= 0 ? '#22c55e' : '#ef4444',
                }}
              >
                {change >= 0 ? '+' : ''}
                {change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </span>
            </Text>
            {alert.message && (
              <Text style={text}>
                <strong>Message:</strong> {alert.message}
              </Text>
            )}
          </Section>
          <Section style={section}>
            <Text style={text}>
              View more details in your{' '}
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/alerts`} style={link}>
                alerts dashboard
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  padding: '17px 0 0',
};

const text = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

export default AlertEmail; 