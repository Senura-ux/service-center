import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff0038",
    marginBottom: 5,
    textAlign: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: "#000039",
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#666666",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 12,
    color: "#666666",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  footerText: {
    marginBottom: 5, // Add some space between the footer texts
  },
  logo: {
    width: 100, // Adjust the size as needed
    height: 'auto',
  },
});

// BreakdownReport Component
const BreakdownReport = ({ breakdownRequest }) => {
  const {
    customerName,
    contactNumber,
    vehicleNumber,
    issueType,
    location,
    totalDistance,
    totalCharge,
  } = breakdownRequest; // Destructure breakdownRequest here

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="../../../images/AaaaAuto (1).png" // Path to your logo image
          />
          <View>
            <Text style={styles.title}>Breakdown Request Report</Text>
            <Text style={styles.companyName}>Ashan Auto Service</Text>
          </View>
        </View>

        {/* Customer Information Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact Number:</Text>
            <Text style={styles.value}>{contactNumber}</Text>
          </View>
        </View>

        {/* Vehicle Information Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Vehicle Number:</Text>
            <Text style={styles.value}>{vehicleNumber}</Text>
          </View>
        </View>

        {/* Breakdown Information Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Breakdown Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Issue Type:</Text>
            <Text style={styles.value}>{issueType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Distance:</Text>
            <Text style={styles.value}>{totalDistance} km</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Charge:</Text>
            <Text style={styles.value}>Rs {totalCharge}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Company Name: Ashan Auto Service
          </Text>
          <Text style={styles.footerText}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BreakdownReport;
