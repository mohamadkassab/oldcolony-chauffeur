import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { Booking } from '@prisma/client';
import { formatUSD, formatRideDateTime, SERVICE_LABEL, formatVehicle } from '@/lib/format';

// Business details shown on the invoice header. Hardcoded for now (matches the
// site's LocalBusiness schema); can move to an admin Settings record later.
const BUSINESS = {
  name: 'Old Colony Chauffeur',
  address: 'Canton, MA',
  phone: '(781) 234-5451',
  email: 'info@oldcolonychauffeur.com',
};

const MAGENTA = '#B08D57';
const DARK = '#12263A';
const GRAY = '#6F6A5E';
const BORDER = '#E6DDCA';

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, color: DARK, fontFamily: 'Helvetica' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  brand: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: MAGENTA },
  muted: { color: GRAY },
  h: { fontSize: 9, color: GRAY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  section: { marginTop: 28 },
  label: { color: GRAY, width: 90 },
  line: { flexDirection: 'row', marginBottom: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: BORDER, marginVertical: 18 },
  totalBox: {
    marginTop: 24,
    alignSelf: 'flex-end',
    width: 220,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 14,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 9, color: GRAY, textTransform: 'uppercase', letterSpacing: 1 },
  totalAmount: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: MAGENTA },
  footer: { position: 'absolute', bottom: 40, left: 48, right: 48, textAlign: 'center', color: GRAY, fontSize: 9 },
});

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label}</Text>
      <Text style={{ flex: 1 }}>{value}</Text>
    </View>
  );
}

function InvoiceDocument({ booking }: { booking: Booking }) {
  const finalPrice = booking.finalPrice != null ? Number(booking.finalPrice) : 0;
  const issued = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(),
  );

  return (
    <Document title={`Invoice ${booking.reference}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.row}>
          <View>
            <Text style={styles.brand}>{BUSINESS.name}</Text>
            <Text style={styles.muted}>{BUSINESS.address}</Text>
            <Text style={styles.muted}>{BUSINESS.phone}</Text>
            <Text style={styles.muted}>{BUSINESS.email}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold' }}>INVOICE</Text>
            <Text style={styles.muted}>{booking.reference}</Text>
            <Text style={styles.muted}>Issued {issued}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill to */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h}>Bill to</Text>
            <Text>{booking.name}</Text>
            {booking.email ? <Text style={styles.muted}>{booking.email}</Text> : null}
            <Text style={styles.muted}>{booking.phone}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h}>Ride</Text>
            <Text>{formatRideDateTime(booking.scheduledAt)}</Text>
            <Text style={styles.muted}>
              {SERVICE_LABEL[booking.serviceType]} · {formatVehicle(booking.vehicleId, booking.vehicleType)}
            </Text>
          </View>
        </View>

        {/* Trip details */}
        <View style={styles.section}>
          <Text style={styles.h}>Trip details</Text>
          <Line label="From" value={booking.pickup} />
          <Line label="To" value={booking.dropoff} />
          <Line
            label="Passengers"
            value={`${booking.passengers}${booking.luggageCount ? ` · ${booking.luggageCount} bags` : ''}`}
          />
          {booking.flightNumber ? <Line label="Flight" value={booking.flightNumber} /> : null}
        </View>

        {/* Total */}
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatUSD(finalPrice)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for riding with {BUSINESS.name}. Questions? {BUSINESS.phone}
        </Text>
      </Page>
    </Document>
  );
}

export function renderInvoicePdf(booking: Booking): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument booking={booking} />);
}
