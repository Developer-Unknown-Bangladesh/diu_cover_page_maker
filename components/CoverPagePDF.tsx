import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
});

// Register additional decorative font
Font.register({
  family: "Montserrat",
  src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf",
});

const themeStyles = {
  classic: {
    backgroundColor: "#ffffff",
    primaryColor: "#000000",
    secondaryColor: "#333333",
    borderColor: "#000000",
    fontFamily: "Roboto",
    headerFont: "Roboto",
    backgroundImage: null,
    gradient: false,
  },
  modern: {
    backgroundColor: "#f0f7ff",
    primaryColor: "#1a56db",
    secondaryColor: "#2563eb",
    borderColor: "#3b82f6",
    fontFamily: "Roboto",
    headerFont: "Montserrat",
    backgroundImage: "/patterns/modern-pattern.png",
    gradient: true,
    gradientColors: ["#f0f7ff", "#e0edff"],
  },
  elegant: {
    backgroundColor: "#f8f9fa",
    primaryColor: "#4b5563",
    secondaryColor: "#6b7280",
    borderColor: "#9ca3af",
    fontFamily: "Montserrat",
    headerFont: "Montserrat",
    backgroundImage: "/patterns/elegant-pattern.png",
    gradient: true,
    gradientColors: ["#f8f9fa", "#ebedef"],
  },
  professional: {
    backgroundColor: "#eef2ff",
    primaryColor: "#4f46e5",
    secondaryColor: "#6366f1",
    borderColor: "#818cf8",
    fontFamily: "Roboto",
    headerFont: "Montserrat",
    backgroundImage: "/patterns/professional-pattern.png",
    gradient: true,
    gradientColors: ["#eef2ff", "#e0e7ff"],
  },
  formal: {
    backgroundColor: "#fffbeb",
    primaryColor: "#92400e",
    secondaryColor: "#b45309",
    borderColor: "#d97706",
    fontFamily: "Roboto",
    headerFont: "Montserrat",
    backgroundImage: "/patterns/formal-pattern.png",
    gradient: true,
    gradientColors: ["#fffbeb", "#fef3c7"],
  },
};

const CoverPagePDF = ({ data, theme = "classic" }) => {
  const currentTheme = themeStyles[theme];

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: currentTheme.backgroundColor,
      fontFamily: currentTheme.fontFamily,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // Center content vertically
    },
    container: {
      flex: 1,
      borderWidth: 1,
      borderColor: currentTheme.borderColor,
      padding: 30,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center", // Center content vertically
      position: "relative",
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.05,
    },
    logo: {
      width: 180, // Increased width for horizontal logo
      height: 100,
      marginBottom: 20,
      objectFit: "contain",
    },
    documentType: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: currentTheme.primaryColor,
      textAlign: "center",
      fontFamily: currentTheme.headerFont,
    },
    section: {
      width: "100%",
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      marginBottom: 6,
    },
    label: {
      width: 150,
      fontWeight: "medium",
      color: currentTheme.secondaryColor,
    },
    value: {
      flex: 1,
      color: currentTheme.primaryColor,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.borderColor,
      marginVertical: 10,
      width: "100%",
    },
    universityName: {
      fontSize: 14,
      fontWeight: "medium",
      marginTop: 5,
      marginBottom: 10,
      color: currentTheme.primaryColor,
    },
    submissionDate: {
      marginTop: 15,
      fontSize: 12,
      color: currentTheme.secondaryColor,
    },
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {currentTheme.backgroundImage && (
            <Image src={currentTheme.backgroundImage} style={styles.backgroundImage} />
          )}
          
          <Image src="/diu_logo.png" style={styles.logo} />
          
          <Text style={styles.documentType}>{data.type}</Text>
          
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Course Code:</Text>
              <Text style={styles.value}>{data.courseCode}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Course Title:</Text>
              <Text style={styles.value}>{data.courseTitle}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Topic:</Text>
              <Text style={styles.value}>{data.topic}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={[styles.label, { marginBottom: 6 }]}>Submitted To:</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>Teacher's Name:</Text>
              <Text style={styles.value}>{data.teacherName}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Designation:</Text>
              <Text style={styles.value}>{data.designation}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Department:</Text>
              <Text style={styles.value}>{data.teacherDepartment}</Text>
            </View>
          </View>
          
          <Text style={styles.universityName}>Daffodil International University</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={[styles.label, { marginBottom: 6 }]}>Submitted By:</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>Student Name:</Text>
              <Text style={styles.value}>{data.studentName}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{data.studentId}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Section:</Text>
              <Text style={styles.value}>{data.section}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Department:</Text>
              <Text style={styles.value}>{data.studentDepartment}</Text>
            </View>
          </View>
          
          <Text style={styles.universityName}>Daffodil International University</Text>
          
          <Text style={styles.submissionDate}>
            Date of submission: {formatDate(data.submissionDate)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CoverPagePDF; 