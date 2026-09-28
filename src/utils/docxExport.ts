import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import { RPPMDocument } from '../types/rppm';

export type ExportScope = 'lengkap' | 'formatif' | 'kunci' | 'lkm' | 'semua';

export async function exportRPPMToDocx(
  doc: RPPMDocument,
  scope: ExportScope = 'lengkap',
  separateFiles: boolean = false
): Promise<{ fileName: string; blob: Blob }[]> {
  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '_');
  const baseName = `RPPM_${sanitize(doc.identitas.mataPelajaran)}_${sanitize(doc.identitas.kelas)}_Pertemuan${doc.pertemuanDipilih.nomorPertemuan}`;

  if (separateFiles && scope === 'semua') {
    // Generate multiple files
    const rppmBlob = await generateDocxBlob(doc, 'lengkap');
    const formatifBlob = await generateDocxBlob(doc, 'formatif');
    const kunciBlob = await generateDocxBlob(doc, 'kunci');
    const lkmBlob = await generateDocxBlob(doc, 'lkm');

    return [
      { fileName: `${baseName}_Perangkat_RPPM.docx`, blob: rppmBlob },
      { fileName: `${baseName}_Asesmen_Formatif.docx`, blob: formatifBlob },
      { fileName: `${baseName}_Kunci_Jawaban.docx`, blob: kunciBlob },
      { fileName: `${baseName}_LKM_dan_Rubrik.docx`, blob: lkmBlob },
    ];
  }

  const blob = await generateDocxBlob(doc, scope);
  let fileName = `${baseName}.docx`;
  if (scope === 'formatif') fileName = `${baseName}_Asesmen_Formatif.docx`;
  if (scope === 'kunci') fileName = `${baseName}_Kunci_Jawaban.docx`;
  if (scope === 'lkm') fileName = `${baseName}_LKM_dan_Rubrik.docx`;

  return [{ fileName, blob }];
}

async function generateDocxBlob(doc: RPPMDocument, scope: ExportScope): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  const defaultBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'B0BEC5' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'B0BEC5' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'B0BEC5' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'B0BEC5' },
  };

  const createCell = (
    text: string | Paragraph[],
    widthPercent: number,
    isHeader = false,
    bold = false
  ) => {
    let content: Paragraph[];
    if (typeof text === 'string') {
      content = [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: bold || isHeader,
              font: 'Arial',
              size: isHeader ? 22 : 21, // 11pt or 10.5pt
              color: isHeader ? '1E293B' : '334155',
            }),
          ],
          spacing: { before: 80, after: 80 },
        }),
      ];
    } else {
      content = text;
    }

    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: isHeader ? { fill: 'F1F5F9' } : undefined,
      borders: defaultBorder,
      children: content,
      margins: { top: 120, bottom: 120, left: 150, right: 150 },
    });
  };

  const createSectionHeader = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 260, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          font: 'Arial',
          size: 24, // 12pt
          color: '0F172A',
        }),
      ],
    });
  };

  // Header document title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: 'RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM (RPPM)',
          bold: true,
          font: 'Arial',
          size: 28, // 14pt
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: 'KURIKULUM MERDEKA – SEKOLAH DASAR',
          bold: true,
          font: 'Arial',
          size: 24, // 12pt
          color: '2563EB',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: `Satuan Pendidikan: ${doc.identitas.satuanPendidikan} | Mata Pelajaran: ${doc.identitas.mataPelajaran}`,
          italics: true,
          font: 'Arial',
          size: 20, // 10pt
          color: '64748B',
        }),
      ],
    })
  );

  // If scope includes complete RPPM or all
  if (scope === 'lengkap' || scope === 'semua') {
    // 1. Identitas RPPM
    children.push(createSectionHeader('IDENTITAS RPPM'));
    const identitasRows = [
      ['Komponen', 'Keterangan'],
      ['Identitas Penulis / Guru', doc.identitas.namaGuru + (doc.identitas.nipGuru ? ` (NIP. ${doc.identitas.nipGuru})` : '')],
      ['Kepala Sekolah', doc.identitas.kepalaSekolah + (doc.identitas.nipKepalaSekolah ? ` (NIP. ${doc.identitas.nipKepalaSekolah})` : '')],
      ['Satuan Pendidikan', doc.identitas.satuanPendidikan],
      ['Fase / Kelas', `${doc.identitas.fase} / ${doc.identitas.kelas}`],
      ['Semester', doc.identitas.semester],
      ['Mata Pelajaran', doc.identitas.mataPelajaran],
      ['Pertemuan Ke (Nomor Pertemuan)', `Pertemuan Ke-${doc.pertemuanDipilih.pertemuanKe} (Nomor: ${doc.pertemuanDipilih.nomorPertemuan})`],
      ['Alokasi Waktu', `${doc.pertemuanDipilih.alokasiWaktuText} (${doc.pertemuanDipilih.alokasiMenit} Menit)`],
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: identitasRows.map((row, idx) =>
          new TableRow({
            children: [
              createCell(row[0], 35, idx === 0, idx > 0),
              createCell(row[1], 65, idx === 0),
            ],
          })
        ),
      })
    );

    // I. Identifikasi Perencanaan
    children.push(createSectionHeader('I. IDENTIFIKASI PERENCANAAN'));
    const dimensiText = doc.perencanaan.dimensiProfil
      .map(d => `• ${d.dimensi}: ${d.keterkaitan}`)
      .join('\n\n');

    const rencanaRows = [
      ['Komponen', 'Deskripsi'],
      ['Kesiapan Murid', doc.perencanaan.kesiapanMurid],
      ['Karakteristik Materi', doc.perencanaan.karakteristikMateri],
      ['Dimensi Profil Lulusan & Keterkaitan Aktivitas', dimensiText],
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rencanaRows.map((row, idx) =>
          new TableRow({
            children: [
              createCell(row[0], 30, idx === 0, idx > 0),
              createCell(row[1], 70, idx === 0),
            ],
          })
        ),
      })
    );

    // II. Desain Pembelajaran
    children.push(createSectionHeader('II. DESAIN PEMBELAJARAN'));
    const kktpText = doc.desain.kktpTerpilih.map((k, i) => `${i + 1}. ${k}`).join('\n');
    const metodeText = doc.desain.metodePembelajaran.join(', ');

    const desainRows = [
      ['Komponen', 'Deskripsi'],
      ['Topik Pembelajaran', doc.desain.topikPembelajaran],
      ['Tujuan Pembelajaran (TP)', doc.desain.tujuanPembelajaran],
      ['Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)', kktpText],
      ['Model Pembelajaran', `${doc.desain.modelPembelajaran}\n\nAlasan Pemilihan: ${doc.desain.alasanModel}`],
      ['Metode Pembelajaran', metodeText],
      ['Kemitraan Pembelajaran', doc.desain.kemitraanPembelajaran],
      ['Lingkungan Pembelajaran', doc.desain.lingkunganPembelajaran],
      ['Pemanfaatan Digital', doc.desain.pemanfaatanDigital],
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: desainRows.map((row, idx) =>
          new TableRow({
            children: [
              createCell(row[0], 30, idx === 0, idx > 0),
              createCell(row[1], 70, idx === 0),
            ],
          })
        ),
      })
    );

    // III. Pengalaman Belajar
    children.push(createSectionHeader('III. PENGALAMAN BELAJAR'));
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: `Fokus Pengalaman Belajar Pertemuan ${doc.pertemuanDipilih.nomorPertemuan}: `,
            bold: true,
            font: 'Arial',
            size: 22,
          }),
          new TextRun({
            text: `${doc.pengalamanBelajar.fokus} | Total Alokasi Waktu: ${doc.pengalamanBelajar.waktuTotal}`,
            bold: true,
            font: 'Arial',
            color: '2563EB',
            size: 22,
          }),
        ],
      })
    );

    // Kegiatan Table
    const kegiatanRows: TableRow[] = [];
    // Header
    kegiatanRows.push(
      new TableRow({
        children: [
          createCell('Tahap / Sintaks', 28, true),
          createCell('Kegiatan Pembelajaran (Berpusat pada Murid, Mindful, Meaningful, Joyful)', 57, true),
          createCell('Alokasi Waktu', 15, true),
        ],
      })
    );

    // Kegiatan Awal
    const awalParagraphs = doc.pengalamanBelajar.kegiatanAwal.langkah.map(
      (step, idx) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${idx + 1}. ${step}`,
              font: 'Arial',
              size: 21,
            }),
          ],
          spacing: { before: 40, after: 40 },
        })
    );
    kegiatanRows.push(
      new TableRow({
        children: [
          createCell('A. KEGIATAN AWAL\n(Salam, Presensi, Apersepsi, Motivasi, Asesmen Awal, Pertanyaan Pemantik, Penyampaian TP)', 28, false, true),
          createCell(awalParagraphs, 57),
          createCell(doc.pengalamanBelajar.kegiatanAwal.waktu, 15),
        ],
      })
    );

    // Kegiatan Inti
    doc.pengalamanBelajar.kegiatanInti.sintaksList.forEach((sintaks, sIdx) => {
      const stepParagraphs = sintaks.kegiatan.map(
        (step, idx) =>
          new Paragraph({
            children: [
              new TextRun({
                text: `${idx + 1}. ${step}`,
                font: 'Arial',
                size: 21,
              }),
            ],
            spacing: { before: 40, after: 40 },
          })
      );

      kegiatanRows.push(
        new TableRow({
          children: [
            createCell(`B.${sIdx + 1} ${sintaks.tahap}`, 28, false, true),
            createCell(stepParagraphs, 57),
            createCell(sintaks.waktu, 15),
          ],
        })
      );
    });

    // Ice Breaking
    const iceParagraphs = doc.pengalamanBelajar.kegiatanInti.iceBreaking.map(
      (step, idx) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${idx + 1}. ${step}`,
              font: 'Arial',
              size: 21,
            }),
          ],
          spacing: { before: 40, after: 40 },
        })
    );
    kegiatanRows.push(
      new TableRow({
        children: [
          createCell('B.AKHIR: ICE BREAKING & APRESIASI\n(Joyful Learning)', 28, false, true),
          createCell(iceParagraphs, 57),
          createCell('5 menit', 15),
        ],
      })
    );

    // Kegiatan Penutup
    const penutupParagraphs = doc.pengalamanBelajar.kegiatanPenutup.langkah.map(
      (step, idx) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${idx + 1}. ${step}`,
              font: 'Arial',
              size: 21,
            }),
          ],
          spacing: { before: 40, after: 40 },
        })
    );
    kegiatanRows.push(
      new TableRow({
        children: [
          createCell('C. KEGIATAN PENUTUP\n(Refleksi, Umpan Balik, Tindak Lanjut, Karakter, Doa, Salam)', 28, false, true),
          createCell(penutupParagraphs, 57),
          createCell(doc.pengalamanBelajar.kegiatanPenutup.waktu, 15),
        ],
      })
    );

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: kegiatanRows,
      })
    );

    // IV. Asesmen Pembelajaran
    children.push(createSectionHeader('IV. ASESMEN PEMBELAJARAN'));
    const asesmenRows = [
      ['Jenis Asesmen', 'Bentuk dan Instrumen'],
      ['A. Asesmen Awal (Diagnostik)', doc.asesmen.asesmenAwal.map((a, i) => `${i + 1}. ${a}`).join('\n')],
      ['B. Asesmen Formatif (Proses)', doc.asesmen.asesmenProses.map((a, i) => `${i + 1}. ${a}`).join('\n')],
      ['C. Asesmen Akhir Pembelajaran', doc.asesmen.asesmenAkhir.map((a, i) => `${i + 1}. ${a}`).join('\n')],
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: asesmenRows.map((row, idx) =>
          new TableRow({
            children: [
              createCell(row[0], 35, idx === 0, idx > 0),
              createCell(row[1], 65, idx === 0),
            ],
          })
        ),
      })
    );

    // Materi Ajar
    children.push(createSectionHeader('V. MATERI AJAR & SUMBER BELAJAR'));
    const subKonsepText = doc.materiAjar.subKonsep.map((s, i) => `${i + 1}. ${s}`).join('\n');
    const tahapText = doc.materiAjar.penjelasanBertahap.join('\n\n');
    const contohText = doc.materiAjar.contohKontekstual.join('\n');

    const materiRows = [
      ['Komponen Materi', 'Uraian'],
      ['Konsep Inti', doc.materiAjar.konsepInti],
      ['Subkonsep', subKonsepText],
      ['Penjelasan Bertahap', tahapText],
      ['Contoh Kontekstual', contohText],
      ['Hubungan Kehidupan Sehari-hari', doc.materiAjar.hubunganKehidupanNyata],
      ['Sumber Belajar Utama', doc.materiAjar.sumberBelajar],
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: materiRows.map((row, idx) =>
          new TableRow({
            children: [
              createCell(row[0], 30, idx === 0, idx > 0),
              createCell(row[1], 70, idx === 0),
            ],
          })
        ),
      })
    );
  }

  // LKM Section
  if (scope === 'lkm' || scope === 'lengkap' || scope === 'semua') {
    children.push(createSectionHeader('LEMBAR KERJA MURID (LKM)'));
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 120 },
        children: [
          new TextRun({
            text: doc.lkm.judul,
            bold: true,
            font: 'Arial',
            size: 23,
            color: '1E3A8A',
          }),
        ],
      })
    );

    // LKM details
    const lkmDetailRows = [
      ['Bagian LKM', 'Rincian Lembar Kerja'],
      ['Tujuan Pembelajaran', doc.lkm.tujuan.map((t, i) => `${i + 1}. ${t}`).join('\n')],
      ['Alat dan Bahan', doc.lkm.alatDanBahan.map((a, i) => `• ${a}`).join('\n')],
      ['Langkah Kerja Kelompok', doc.lkm.langkahKerja.map((l, i) => `${i + 1}. ${l}`).join('\n')],
      ['Tugas Murid (Penyelidikan)', doc.lkm.tugasMurid.map((t, i) => `${i + 1}. ${t}`).join('\n\n')],
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: lkmDetailRows.map((row, idx) =>
          new TableRow({
            children: [
              createCell(row[0], 28, idx === 0, idx > 0),
              createCell(row[1], 72, idx === 0),
            ],
          })
        ),
      })
    );

    // Rubrik Penilaian LKM
    children.push(createSectionHeader('RUBRIK PENILAIAN LKM'));
    const rubrikRows = [
      ['Aspek yang Dinilai', 'Sangat Baik (Skor 4)', 'Baik (Skor 3)', 'Cukup (Skor 2)', 'Perlu Bimbingan (Skor 1)'],
      ...doc.lkm.rubrikPenilaian.map(r => [r.aspek, r.skor4, r.skor3, r.skor2, r.skor1]),
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rubrikRows.map((row, idx) =>
          new TableRow({
            children: [
              createCell(row[0], 24, idx === 0, idx > 0),
              createCell(row[1], 19, idx === 0),
              createCell(row[2], 19, idx === 0),
              createCell(row[3], 19, idx === 0),
              createCell(row[4], 19, idx === 0),
            ],
          })
        ),
      })
    );

    // Kunci Jawaban LKM
    children.push(createSectionHeader('KUNCI JAWABAN LKM'));
    doc.lkm.kunciJawaban.forEach((kunci, i) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: `${i + 1}. ${kunci}`,
              font: 'Arial',
              size: 21,
            }),
          ],
        })
      );
    });
  }

  // Asesmen Formatif Section
  if (doc.asesmenFormatif && (scope === 'formatif' || scope === 'semua' || (scope === 'lengkap' && doc.formatifConfig.selectedBentuk.length > 0))) {
    children.push(createSectionHeader('ASESMEN FORMATIF (SOAL EVALUASI)'));

    // Kisi-kisi jika diaktifkan
    if (doc.formatifConfig.tampilkanKisiKisi && doc.asesmenFormatif.kisiKisi.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 180, after: 100 },
          children: [
            new TextRun({
              text: 'KISI-KISI ASESMEN FORMATIF',
              bold: true,
              font: 'Arial',
              size: 22,
            }),
          ],
        })
      );

      const kisiRows = [
        ['No', 'Bentuk Soal', 'KKTP yang Diukur', 'Indikator Soal', 'Tingkat Kesulitan'],
        ...doc.asesmenFormatif.kisiKisi.map(k => [
          k.nomor.toString(),
          k.bentukSoal,
          k.kktp,
          k.indikatorSoal,
          k.tingkatKesulitan,
        ]),
      ];

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: kisiRows.map((row, idx) =>
            new TableRow({
              children: [
                createCell(row[0], 8, idx === 0),
                createCell(row[1], 18, idx === 0),
                createCell(row[2], 26, idx === 0),
                createCell(row[3], 34, idx === 0),
                createCell(row[4], 14, idx === 0),
              ],
            })
          ),
        })
      );
    }

    // Soal Items
    // 1. Pilihan Ganda
    if (doc.asesmenFormatif.soalPG.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'A. SOAL PILIHAN GANDA',
              bold: true,
              font: 'Arial',
              size: 22,
            }),
          ],
        })
      );

      doc.asesmenFormatif.soalPG.forEach(soal => {
        if (soal.stimulus) {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: `[Stimulus No. ${soal.nomor}] ${soal.stimulus}`,
                  italics: true,
                  font: 'Arial',
                  size: 20,
                  color: '475569',
                }),
              ],
            })
          );
        }

        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: `${soal.nomor}. ${soal.pertanyaan}`,
                bold: true,
                font: 'Arial',
                size: 21,
              }),
            ],
          })
        );

        soal.opsi.forEach(opt => {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              indent: { left: 400 },
              children: [
                new TextRun({
                  text: `${opt.key}. ${opt.text}`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });

        if (doc.formatifConfig.kunciJawabanMode === 'sertakan') {
          children.push(
            new Paragraph({
              spacing: { before: 40, after: 80 },
              indent: { left: 400 },
              children: [
                new TextRun({
                  text: `Kunci Jawaban: ${soal.kunci} | ${soal.pembahasan || ''}`,
                  font: 'Arial',
                  size: 20,
                  color: '166534',
                  italics: true,
                }),
              ],
            })
          );
        }
      });
    }

    // 2. Pilihan Ganda Kompleks
    if (doc.asesmenFormatif.soalPGKompleks.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'B. SOAL PILIHAN GANDA KOMPLEKS',
              bold: true,
              font: 'Arial',
              size: 22,
            }),
          ],
        })
      );

      doc.asesmenFormatif.soalPGKompleks.forEach(soal => {
        if (soal.stimulus) {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: `[Stimulus No. ${soal.nomor}] ${soal.stimulus}`,
                  italics: true,
                  font: 'Arial',
                  size: 20,
                }),
              ],
            })
          );
        }

        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: `${soal.nomor}. ${soal.pertanyaan} (${soal.petunjuk})`,
                bold: true,
                font: 'Arial',
                size: 21,
              }),
            ],
          })
        );

        soal.opsi.forEach(opt => {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              indent: { left: 400 },
              children: [
                new TextRun({
                  text: `[  ] ${opt.key}. ${opt.text}`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });

        if (doc.formatifConfig.kunciJawabanMode === 'sertakan') {
          children.push(
            new Paragraph({
              spacing: { before: 40, after: 80 },
              indent: { left: 400 },
              children: [
                new TextRun({
                  text: `Kunci Jawaban: ${soal.kunci.join(', ')} | ${soal.pembahasan || ''}`,
                  font: 'Arial',
                  size: 20,
                  color: '166534',
                  italics: true,
                }),
              ],
            })
          );
        }
      });
    }

    // 3. Benar-Salah
    if (doc.asesmenFormatif.soalBenarSalah.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'C. SOAL BENAR - SALAH',
              bold: true,
              font: 'Arial',
              size: 22,
            }),
          ],
        })
      );

      doc.asesmenFormatif.soalBenarSalah.forEach(soal => {
        if (soal.stimulus) {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: `[Stimulus No. ${soal.nomor}] ${soal.stimulus}`,
                  italics: true,
                  font: 'Arial',
                  size: 20,
                }),
              ],
            })
          );
        }

        const bsRows = [
          ['No', 'Pernyataan', 'Benar', 'Salah'],
          ...soal.pernyataanList.map((p, i) => [
            `${soal.nomor}.${i + 1}`,
            p.teks,
            doc.formatifConfig.kunciJawabanMode === 'sertakan' && p.kunci === 'Benar' ? '[ ✓ ]' : '[  ]',
            doc.formatifConfig.kunciJawabanMode === 'sertakan' && p.kunci === 'Salah' ? '[ ✓ ]' : '[  ]',
          ]),
        ];

        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: bsRows.map((row, idx) =>
              new TableRow({
                children: [
                  createCell(row[0], 10, idx === 0),
                  createCell(row[1], 66, idx === 0),
                  createCell(row[2], 12, idx === 0),
                  createCell(row[3], 12, idx === 0),
                ],
              })
            ),
          })
        );
      });
    }

    // 4. Menjodohkan
    if (doc.asesmenFormatif.soalMenjodohkan.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'D. SOAL MENJODOHKAN',
              bold: true,
              font: 'Arial',
              size: 22,
            }),
          ],
        })
      );

      doc.asesmenFormatif.soalMenjodohkan.forEach(soal => {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({
                text: `${soal.nomor}. Petunjuk: ${soal.petunjuk}`,
                bold: true,
                font: 'Arial',
                size: 21,
              }),
            ],
          })
        );

        const mjRows = [
          ['Kolom Kiri', 'Kolom Kanan'],
          ...soal.pasangan.map(p => [p.kiri, p.kanan]),
        ];

        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: mjRows.map((row, idx) =>
              new TableRow({
                children: [
                  createCell(row[0], 50, idx === 0),
                  createCell(row[1], 50, idx === 0),
                ],
              })
            ),
          })
        );
      });
    }

    // 5. Isian Singkat
    if (doc.asesmenFormatif.soalIsian.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'E. SOAL ISIAN SINGKAT',
              bold: true,
              font: 'Arial',
              size: 22,
            }),
          ],
        })
      );

      doc.asesmenFormatif.soalIsian.forEach(soal => {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({
                text: `${soal.nomor}. ${soal.pertanyaan}`,
                font: 'Arial',
                size: 21,
              }),
            ],
          })
        );
        if (doc.formatifConfig.kunciJawabanMode === 'sertakan') {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 40 },
              indent: { left: 400 },
              children: [
                new TextRun({
                  text: `Kunci Jawaban: ${soal.kunci}`,
                  font: 'Arial',
                  size: 20,
                  color: '166534',
                  italics: true,
                }),
              ],
            })
          );
        }
      });
    }

    // 6. Uraian
    if (doc.asesmenFormatif.soalUraian.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'F. SOAL URAIAN (PENALARAN TINGGI)',
              bold: true,
              font: 'Arial',
              size: 22,
            }),
          ],
        })
      );

      doc.asesmenFormatif.soalUraian.forEach(soal => {
        if (soal.stimulus) {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: `[Kasus No. ${soal.nomor}] ${soal.stimulus}`,
                  italics: true,
                  font: 'Arial',
                  size: 20,
                }),
              ],
            })
          );
        }

        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: `${soal.nomor}. ${soal.pertanyaan}`,
                bold: true,
                font: 'Arial',
                size: 21,
              }),
            ],
          })
        );

        if (doc.formatifConfig.kunciJawabanMode === 'sertakan') {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 60 },
              indent: { left: 400 },
              children: [
                new TextRun({
                  text: `Kunci Jawaban: ${soal.kunci}\nPedoman Penskoran: ${soal.pedomanPenskoran}`,
                  font: 'Arial',
                  size: 20,
                  color: '166534',
                  italics: true,
                }),
              ],
            })
          );
        }
      });
    }
  }

  // Kunci Jawaban Pisahkan Mode
  if (
    scope === 'kunci' ||
    (scope === 'semua' && doc.formatifConfig.kunciJawabanMode === 'pisahkan') ||
    (scope === 'lengkap' && doc.formatifConfig.kunciJawabanMode === 'pisahkan')
  ) {
    if (doc.asesmenFormatif) {
      children.push(createSectionHeader('KUNCI JAWABAN ASESMEN FORMATIF'));

      // PG keys
      if (doc.asesmenFormatif.soalPG.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: 'Kunci Pilihan Ganda:', bold: true, font: 'Arial', size: 21 })],
          })
        );
        doc.asesmenFormatif.soalPG.forEach(p => {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: `No. ${p.nomor}: ${p.kunci} (${p.pembahasan || 'Sesuai indikator KKTP'})`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });
      }

      // PG Kompleks keys
      if (doc.asesmenFormatif.soalPGKompleks.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: 'Kunci Pilihan Ganda Kompleks:', bold: true, font: 'Arial', size: 21 })],
          })
        );
        doc.asesmenFormatif.soalPGKompleks.forEach(p => {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: `No. ${p.nomor}: Jawaban Benar adalah [ ${p.kunci.join(', ')} ]`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });
      }

      // Benar-Salah keys
      if (doc.asesmenFormatif.soalBenarSalah.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: 'Kunci Benar - Salah:', bold: true, font: 'Arial', size: 21 })],
          })
        );
        doc.asesmenFormatif.soalBenarSalah.forEach(bs => {
          const keys = bs.pernyataanList.map((p, i) => `${i + 1}) ${p.kunci}`).join(', ');
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: `No. ${bs.nomor}: ${keys}`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });
      }

      // Menjodohkan keys
      if (doc.asesmenFormatif.soalMenjodohkan.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: 'Kunci Menjodohkan:', bold: true, font: 'Arial', size: 21 })],
          })
        );
        doc.asesmenFormatif.soalMenjodohkan.forEach(mj => {
          const pairs = mj.pasangan.map(p => p.kunciPasangan).join('; ');
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: `No. ${mj.nomor}: ${pairs}`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });
      }

      // Isian keys
      if (doc.asesmenFormatif.soalIsian.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: 'Kunci Isian Singkat:', bold: true, font: 'Arial', size: 21 })],
          })
        );
        doc.asesmenFormatif.soalIsian.forEach(is => {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: `No. ${is.nomor}: ${is.kunci}`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });
      }

      // Uraian keys
      if (doc.asesmenFormatif.soalUraian.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: 'Kunci & Pedoman Penskoran Uraian:', bold: true, font: 'Arial', size: 21 })],
          })
        );
        doc.asesmenFormatif.soalUraian.forEach(ur => {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: `No. ${ur.nomor}: ${ur.kunci}\nPedoman Penskoran: ${ur.pedomanPenskoran}`,
                  font: 'Arial',
                  size: 21,
                }),
              ],
            })
          );
        });
      }
    }
  }

  // Signature Block
  children.push(
    new Paragraph({ spacing: { before: 300, after: 80 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Mengetahui,', font: 'Arial', size: 21 })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Kepala ${doc.identitas.satuanPendidikan}`, font: 'Arial', size: 21 })],
                }),
                new Paragraph({ spacing: { before: 800 } }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: doc.identitas.kepalaSekolah,
                      bold: true,
                      underline: {},
                      font: 'Arial',
                      size: 21,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: doc.identitas.nipKepalaSekolah ? `NIP. ${doc.identitas.nipKepalaSekolah}` : 'NIP. -',
                      font: 'Arial',
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${doc.identitas.satuanPendidikan.split(' ')[0] || 'Anggrek'}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                      font: 'Arial',
                      size: 21,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Guru Mata Pelajaran / Kelas,', font: 'Arial', size: 21 })],
                }),
                new Paragraph({ spacing: { before: 800 } }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: doc.identitas.namaGuru,
                      bold: true,
                      underline: {},
                      font: 'Arial',
                      size: 21,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: doc.identitas.nipGuru ? `NIP. ${doc.identitas.nipGuru}` : 'NIP. -',
                      font: 'Arial',
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  const documentFile = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width in DXA (210mm)
              height: 16838, // A4 height in DXA (297mm)
            },
            margin: {
              top: 1440, // 1 inch = 2.54cm
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `RPPM Kurikulum Merdeka - ${doc.identitas.mataPelajaran} ${doc.identitas.kelas} - Pertemuan ${doc.pertemuanDipilih.nomorPertemuan}`,
                    font: 'Arial',
                    size: 16, // 8pt
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Halaman ',
                    font: 'Arial',
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Arial',
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    text: ' | Menyusun RPPM Kurikulum Merdeka - Created by Fery Gustomi Kaharu',
                    font: 'Arial',
                    size: 16,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(documentFile);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
