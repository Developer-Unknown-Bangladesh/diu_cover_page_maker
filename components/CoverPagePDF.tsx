/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path } from "@react-pdf/renderer";

// Register standard fonts that work reliably with React PDF
Font.register({
  family: "Open Sans",
  src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
  fontWeight: 'normal'
});

Font.register({
  family: "Open Sans",
  src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
  fontWeight: 'semibold'
});

Font.register({
  family: "Open Sans",
  src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
  fontWeight: 'bold'
});

Font.register({
  family: "Open Sans",
  src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-800.ttf",
  fontWeight: 'bold'
});

const themeStyles = {
  classic: {
    backgroundColor: "#ffffff",
    primaryColor: "#000000",
    secondaryColor: "#333333",
    accentColor: "#1a365d",
    titleColor: "#2c5282",
    sectionTitleColor: "#2a4365",
    borderColor: "#000000",
    backgroundImage: "/background1.jpg",
    gradient: false,
  },
  modern: {
    backgroundColor: "#f0f7ff",
    primaryColor: "#000000",
    secondaryColor: "#333333",
    accentColor: "#1a56db",
    titleColor: "#1e40af",
    sectionTitleColor: "#3b82f6",
    borderColor: "#3b82f6",
    backgroundImage: "/background2.jpg",
    gradient: true,
    gradientColors: ["#f0f7ff", "#e0edff"],
  },
  elegant: {
    backgroundColor: "#f8f9fa",
    primaryColor: "#000000",
    secondaryColor: "#333333",
    accentColor: "#4b5563",
    titleColor: "#374151",
    sectionTitleColor: "#4b5563",
    borderColor: "#9ca3af",
    backgroundImage: "/background3.jpg",
    gradient: true,
    gradientColors: ["#f8f9fa", "#ebedef"],
  },
  professional: {
    backgroundColor: "#eef2ff",
    primaryColor: "#000000",
    secondaryColor: "#333333",
    accentColor: "#4f46e5",
    titleColor: "#4338ca",
    sectionTitleColor: "#4f46e5",
    borderColor: "#818cf8",
    backgroundImage: "/background4.jpg",
    gradient: true,
    gradientColors: ["#eef2ff", "#e0e7ff"],
  },
  formal: {
    backgroundColor: "#fffbeb",
    primaryColor: "#000000",
    secondaryColor: "#333333",
    accentColor: "#92400e",
    titleColor: "#78350f",
    sectionTitleColor: "#92400e",
    borderColor: "#d97706",
    backgroundImage: "/background5.jpg",
    gradient: true,
    gradientColors: ["#fffbeb", "#fef3c7"],
  },
};

// SVG Icons without backgrounds
const Icons = {
  course: (color : any) => (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 17L12 22L22 17"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12L12 17L22 12"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  teacher: (color : any) => (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  student: (color : any) => (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  date: (color : any) => (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 2V6"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 2V6"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 10H21"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  university: (color : any) => (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M2 22H22"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2L3 9H21L12 2Z"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 9V17H8V9"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 9V17H19V9"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 9V17H14V9"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
};

import { TitleExperiment } from "./CoverPageForm";

interface CoverPageData {
  type: string;
  courseCode: string;
  courseTitle: string;
  topic: string;
  experimentNo?: string;
  teacherName: string;
  designation: string;
  teacherDepartment: string;
  studentName: string;
  studentId: string;
  section: string;
  studentDepartment: string;
  submissionDate: string;
  titleExperiments?: TitleExperiment[];
}

const CoverPagePDF = ({ data, theme = "classic" }: { data: CoverPageData; theme?: keyof typeof themeStyles }) => {
  const currentTheme = themeStyles[theme];

  // No need for additional variables here

  // Clean up the titleExperiments array to ensure it only contains valid entries
  const validExperiments = data.titleExperiments && Array.isArray(data.titleExperiments) ?
    data.titleExperiments.filter(item => item && (item.title || item.experimentNo)) : [];

  const styles = StyleSheet.create({
    page: {
      position: "relative",
      backgroundColor: currentTheme.backgroundColor,
      fontFamily: "Open Sans", // Using standard font family
    },
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    contentWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    container: {
      flex: 1,
      padding: 28,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.20)", // More opaque for better readability
      borderRadius: 10, // Larger border radius
      border: `2px solid ${currentTheme.borderColor}`, // Added border for better definition
    },
    logo: {
      width: 200,
      height: 80, // Increased logo size
      marginBottom: 20,
      objectFit: "contain",
    },
    documentType: {
      fontSize: 30, // Increased font size
      fontWeight: "extrabold",
      marginBottom: 20,
      color: currentTheme.titleColor,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    section: {
      width: "100%",
      marginBottom: 14, // More space between sections
    },
    row: {
      flexDirection: "row",
      marginBottom: 8, // Increased spacing between rows
      alignItems: "center",
    },
    labelContainer: {
      width: 160, // Increased width for labels
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      marginRight: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      color: "#000000",
      fontSize: 14, // Increased font size
      fontWeight: "bold",
    },
    value: {
      flex: 1,
      color: "#000000",
      fontSize: 14, // Increased font size
      fontWeight: "normal",
    },
    divider: {
      borderBottomWidth: 2, // Thicker divider
      borderBottomColor: currentTheme.borderColor,
      marginVertical: 14, // More space around dividers
      width: "100%",
      opacity: 0.6,
    },
    universityName: {
      fontSize: 20, // Increased font size
      fontWeight: "bold",
      marginTop: 4,
      marginBottom: 8,
      color: currentTheme.accentColor,
      textAlign: "center",
    },
    submissionDateContainer: {
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    submissionDate: {
      fontSize: 13, // Increased font size
      color: "#000000",
      marginLeft: 6,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12, // More space after section titles
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: 16, // Increased font size
      color: currentTheme.sectionTitleColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginLeft: 8,
    },
    decorativeLine: {
      height: 3, // Thicker line
      width: 40, // Wider line
      backgroundColor: currentTheme.accentColor,
      marginBottom: 18, // More space after
    },
    iconStyle: {
      marginRight: 8, // Spacing for icons
    }
  });

  const formatDate = (dateString:any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to render a single page
  const renderPage = (pageData: CoverPageData, customTitle?: string, customExperimentNo?: string) => {
    return (
      <Page size="A4" style={styles.page} key={customTitle || 'main'}>
        {/* Background image layer */}
        {currentTheme.backgroundImage && (
          <View style={styles.background}>
            <Image src={currentTheme.backgroundImage} style={{ width: "100%", height: "100%" }} />
          </View>
        )}

        {/* Content layer that overlaps the background */}
        <View style={styles.contentWrapper}>
          <View style={styles.container}>
            <Image src="/diu_logo.png" style={styles.logo} />

            <Text style={styles.documentType}>{pageData.type}</Text>

            {/* Show experiment number for Lab Reports if provided */}
            {pageData.type === "Lab Report" && (customExperimentNo || pageData.experimentNo) && (
              <Text style={[styles.documentType, { fontSize: 18, marginTop: 5 }]}>
                Experiment No: {customExperimentNo || pageData.experimentNo}
              </Text>
            )}

            <View style={styles.decorativeLine} />

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.iconStyle}>
                  {Icons.course(currentTheme.accentColor)}
                </View>
                <Text style={styles.sectionTitle}>Course Information</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Course Code:</Text>
                </View>
                <Text style={styles.value}>{data.courseCode}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Course Title:</Text>
                </View>
                <Text style={styles.value}>{data.courseTitle}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Topic:</Text>
                </View>
                <Text style={styles.value}>{customTitle || data.topic}</Text>
              </View>

              {/* We don't need to show experiment number here as it's already shown at the top */}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.iconStyle}>
                  {Icons.teacher(currentTheme.accentColor)}
                </View>
                <Text style={styles.sectionTitle}>Submitted To</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Teacher&apos;s Name:</Text>
                </View>
                <Text style={styles.value}>{data.teacherName}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Designation:</Text>
                </View>
                <Text style={styles.value}>{data.designation}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Department:</Text>
                </View>
                <Text style={styles.value}>{data.teacherDepartment}</Text>
              </View>
            </View>

            <View style={{flexDirection: "row", alignItems: "center", marginVertical: 8}}>
              <View style={{marginRight: 8}}>
                {Icons.university(currentTheme.accentColor)}
              </View>
              <Text style={styles.universityName}>Daffodil International University</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.iconStyle}>
                  {Icons.student(currentTheme.accentColor)}
                </View>
                <Text style={styles.sectionTitle}>Submitted By</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Student Name:</Text>
                </View>
                <Text style={styles.value}>{data.studentName}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>ID:</Text>
                </View>
                <Text style={styles.value}>{data.studentId}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Section:</Text>
                </View>
                <Text style={styles.value}>{data.section}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Department:</Text>
                </View>
                <Text style={styles.value}>{data.studentDepartment}</Text>
              </View>
            </View>

            <View style={{flexDirection: "row", alignItems: "center", marginVertical: 8}}>
              <View style={{marginRight: 8}}>
                {Icons.university(currentTheme.accentColor)}
              </View>
              <Text style={styles.universityName}>Daffodil International University</Text>
            </View>

            <View style={styles.submissionDateContainer}>
              <View style={{marginRight: 6}}>
                {Icons.date(currentTheme.accentColor)}
              </View>
              <Text style={styles.submissionDate}>
                Date of submission: {formatDate(pageData.submissionDate)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    );
  };

  return (
    <Document>
      {/* Always render the main page first */}
      {renderPage(data)}

      {/* Render additional pages for each valid title/experiment pair */}
      {validExperiments.map((item) => {
        return renderPage(data, item.title, item.experimentNo);
      })}
    </Document>
  );
};

export default CoverPagePDF;