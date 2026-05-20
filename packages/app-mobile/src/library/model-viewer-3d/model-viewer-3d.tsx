import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import WebView from 'react-native-webview';

type Props = {
  modelUrl: string;
  style?: ViewStyle;
};

// Escape the URL so it's safe to embed in an injected JS string literal.
function escapeUrl(url: string): string {
  return url.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function ModelViewer3D({ modelUrl, style }: Props) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTemplate() {
      const asset = Asset.fromModule(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../../../assets/model-viewer.html') as number
      );
      await asset.downloadAsync();
      if (!asset.localUri) return;
      const content = await FileSystem.readAsStringAsync(asset.localUri);
      if (!cancelled) setHtml(content);
    }

    loadTemplate().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!html) return null;

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html }}
        injectedJavaScriptBeforeContentLoaded={`window.__modelUrl="${escapeUrl(modelUrl)}";true;`}
        originWhitelist={['*']}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#1a1a1a' },
  webview: { flex: 1 },
});
