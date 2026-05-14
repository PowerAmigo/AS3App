import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { C } from '../theme';

export default function QRScannerModal({ visible, onClose, onScanned, title = 'Scan QR Code' }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
    if (visible) setScanned(false);
  }, [visible]);

  const handleBarcode = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    onScanned(data);
    onClose();
  };

  if (!visible) return null;

  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.permDenied}>
          <Text style={styles.permTitle}>Camera Access Required</Text>
          <Text style={styles.permText}>
            Power Amigo needs camera access to scan QR codes on sensors and gateways.
          </Text>
          <Pressable style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Grant Permission</Text>
          </Pressable>
          <Pressable style={[styles.permBtn, styles.permBtnSecondary]} onPress={onClose}>
            <Text style={[styles.permBtnText, { color: C.navy }]}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcode}
        />

        {/* Dark overlay with cutout */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.viewfinder}>
              {/* Corner brackets */}
              {[
                { top: -2, left: -2 },
                { top: -2, right: -2 },
                { bottom: -2, right: -2 },
                { bottom: -2, left: -2 },
              ].map((pos, i) => (
                <View key={i} style={[styles.corner, pos,
                  i === 1 && styles.cornerFlipH,
                  i === 2 && styles.cornerFlip,
                  i === 3 && styles.cornerFlipV,
                ]} />
              ))}
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.label}>{scanned ? 'Scanned!' : title}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const VF = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayMiddle: { flexDirection: 'row', height: VF },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayBottom: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 20,
  },
  viewfinder: {
    width: VF, height: VF, position: 'relative',
    borderRadius: 4,
  },
  corner: {
    position: 'absolute', width: 36, height: 36,
    borderColor: C.cyan,
    borderTopWidth: 4, borderLeftWidth: 4,
    borderRadius: 4,
  },
  cornerFlipH: { transform: [{ scaleX: -1 }] },
  cornerFlip: { transform: [{ scaleX: -1 }, { scaleY: -1 }] },
  cornerFlipV: { transform: [{ scaleY: -1 }] },
  label: {
    color: '#fff', fontWeight: '700', fontSize: 18,
    letterSpacing: 0.5, textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 12,
    paddingHorizontal: 32, borderRadius: 12,
  },
  closeBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  // Permission denied
  permDenied: {
    flex: 1, backgroundColor: C.white, alignItems: 'center',
    justifyContent: 'center', padding: 32, gap: 16,
  },
  permTitle: { fontWeight: '700', fontSize: 22, color: C.navy, textAlign: 'center' },
  permText: { fontSize: 15, color: C.muted, textAlign: 'center', lineHeight: 22 },
  permBtn: {
    width: '100%', height: 52, borderRadius: 12,
    backgroundColor: C.cyan, alignItems: 'center', justifyContent: 'center',
  },
  permBtnSecondary: {
    backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.borderDark,
  },
  permBtnText: { fontWeight: '700', fontSize: 16, color: '#fff' },
});
