import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts
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
  fontWeight: 'extrabold'
});

// Define element types
interface TextElement {
  type: 'text';
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  fontWeight: string;
  color: string;
  align: 'left' | 'center' | 'right';
}

interface ImageElement {
  type: 'image';
  id: string;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

type Element = TextElement | ImageElement;

interface PreviewToPDFProps {
  elements: Element[];
  backgroundImage: string;
  backgroundOverlay?: string;
  backgroundOverlayOpacity?: number;
}

// Helper function to convert rgba to PDF compatible format
const rgbaToRgb = (rgba: string, opacity: number = 0): { r: number; g: number; b: number; opacity: number } => {
  // Default values
  let r = 0, g = 0, b = 0, a = opacity / 100;
  
  // Parse rgba string
  const rgbaMatch = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
  
  // Parse hex color
  const hexMatch = rgba.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
  
  if (rgbaMatch) {
    r = parseInt(rgbaMatch[1]);
    g = parseInt(rgbaMatch[2]);
    b = parseInt(rgbaMatch[3]);
    if (rgbaMatch[4]) {
      a = parseFloat(rgbaMatch[4]) * (opacity / 100);
    }
  } else if (hexMatch) {
    r = parseInt(hexMatch[1], 16);
    g = parseInt(hexMatch[2], 16);
    b = parseInt(hexMatch[3], 16);
  }
  
  return { r: r/255, g: g/255, b: b/255, opacity: a };
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});

const PreviewToPDF: React.FC<PreviewToPDFProps> = ({ 
  elements, 
  backgroundImage,
  backgroundOverlay = '#000000',
  backgroundOverlayOpacity = 0 
}) => {
  // Convert font weight to PDF-compatible values
  const convertFontWeight = (weight: string): string => {
    switch (weight) {
      case 'bold':
        return 'bold';
      case 'semibold':
        return 'semibold';
      case 'extrabold':
        return 'extrabold';
      default:
        return 'normal';
    }
  };

  // Calculate overlay color
  const overlayColor = rgbaToRgb(backgroundOverlay, backgroundOverlayOpacity);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background image */}
        <View style={styles.background}>
          <Image src={backgroundImage} style={{ width: '100%', height: '100%' }} />
        </View>

        {/* Overlay color */}
        {backgroundOverlayOpacity > 0 && (
          <View 
            style={[
              styles.overlay, 
              { 
                backgroundColor: overlayColor,
                opacity: overlayColor.opacity
              }
            ]} 
          />
        )}
        
        {/* Content layer */}
        <View style={styles.content}>
          {elements.map(element => {
            if (element.type === 'text') {
              return (
                <Text
                  key={element.id}
                  style={{
                    position: 'absolute',
                    left: element.position.x,
                    top: element.position.y,
                    fontSize: element.fontSize,
                    fontFamily: 'Open Sans',
                    fontWeight: convertFontWeight(element.fontWeight),
                    color: element.color,
                    textAlign: element.align,
                    width: 300, // Fixed width for text elements
                  }}
                >
                  {element.text}
                </Text>
              );
            } else if (element.type === 'image') {
              return (
                <Image
                  key={element.id}
                  src={element.src}
                  style={{
                    position: 'absolute',
                    left: element.position.x,
                    top: element.position.y,
                    width: element.size.width,
                    height: element.size.height,
                  }}
                />
              );
            }
            return null;
          })}
        </View>
      </Page>
    </Document>
  );
};

export default PreviewToPDF;
