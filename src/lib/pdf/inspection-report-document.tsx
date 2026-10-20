import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InspectionReport } from "@/types";
import { SITE } from "@/lib/constants";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 8 },
  subtitle: { fontSize: 12, color: "#555", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  section: { marginTop: 16, marginBottom: 8, fontSize: 13, fontWeight: 700 },
});

export function InspectionReportDocument({
  report,
}: {
  report: InspectionReport;
}) {
  const inspection = report.inspection;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{SITE.name} Inspection Report</Text>
        <Text style={styles.subtitle}>
          {inspection?.car_brand} {inspection?.car_model}{" "}
          {inspection?.car_year ?? ""}
        </Text>
        <Text>Customer: {inspection?.full_name}</Text>
        <Text>Phone: {inspection?.phone}</Text>
        <Text>Date: {report.completed_at?.slice(0, 10) ?? "—"}</Text>
        <Text style={{ marginTop: 8 }}>
          Overall rating: {report.rating ?? "—"} / 10
        </Text>
        <Text style={styles.section}>Checklist</Text>
        {Object.entries(report.checklist ?? {}).map(([key, val]) => (
          <View key={key} style={styles.row}>
            <Text>{key.replace(/_/g, " ")}</Text>
            <Text>
              {val.score}/10 — {val.notes}
            </Text>
          </View>
        ))}
        <Text style={styles.section}>Inspector remarks</Text>
        <Text>{report.inspector_remarks ?? "—"}</Text>
      </Page>
    </Document>
  );
}
