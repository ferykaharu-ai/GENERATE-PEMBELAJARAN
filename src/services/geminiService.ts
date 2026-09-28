import {
  RPPMProject,
  MeetingItem,
  TPItem,
  KKTPItem,
  RPPMDocument,
} from '../types/rppm';

export async function requestGeminiRPPM(
  project: RPPMProject,
  meeting: MeetingItem,
  tp: TPItem,
  kktps: KKTPItem[]
): Promise<RPPMDocument> {
  const payload = {
    identity: project.identity,
    meeting,
    tp,
    kktps,
    materials: project.materials.map(m => ({ name: m.name, content: m.content.slice(0, 10000) })),
    selectedDimensi: project.selectedDimensi,
    formatifConfig: project.formatifConfig,
  };

  const response = await fetch('/api/generate-gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (!result || !result.desain) {
    throw new Error('Hasil respon Gemini tidak memiliki format RPPM yang valid.');
  }

  // Ensure generatorSource is tagged
  result.generatorSource = 'gemini';
  return result as RPPMDocument;
}
