# SRS - Non-Functional Requirements

## Performance
- NFR-PERF-001: Waktu respon API utama <= 500ms pada p95 untuk beban normal.
- NFR-PERF-002: Halaman utama publik harus TTI <= 3 detik pada koneksi standar.

## Security
- NFR-SEC-001: Password harus disimpan dengan hashing kuat.
- NFR-SEC-002: Semua endpoint sensitif harus memerlukan autentikasi dan otorisasi role.
- NFR-SEC-003: Validasi input wajib pada semua write endpoint.

## Reliability
- NFR-REL-001: Sistem harus memiliki error handling konsisten.
- NFR-REL-002: Operasi penting harus memiliki logging terstruktur.

## Scalability
- NFR-SCL-001: Arsitektur modul harus memungkinkan pemisahan service di fase lanjut.
- NFR-SCL-002: Layer data harus mendukung pagination dan filtering efisien.

## Maintainability
- NFR-MTN-001: Kode harus typed, lint-friendly, dan mengikuti standar folder berbasis domain.
- NFR-MTN-002: Logic bisnis harus terpisah dari layer UI.

## Observability
- NFR-OBS-001: Monitoring error runtime wajib aktif di environment production.
- NFR-OBS-002: Metrik dasar API latency dan failure rate harus terekam.
