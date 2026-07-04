// Indonesian provinces with their cities/regencies (kota & kabupaten).
// Built-in so checkout works without any external API.

export const REGIONS: Record<string, string[]> = {
    'Aceh': ['Banda Aceh', 'Langsa', 'Lhokseumawe', 'Sabang', 'Subulussalam', 'Aceh Besar', 'Bireuen', 'Pidie'],
    'Sumatera Utara': ['Medan', 'Binjai', 'Pematangsiantar', 'Tebing Tinggi', 'Tanjungbalai', 'Sibolga', 'Padang Sidempuan', 'Gunungsitoli', 'Deli Serdang', 'Karo'],
    'Sumatera Barat': ['Padang', 'Bukittinggi', 'Padang Panjang', 'Payakumbuh', 'Pariaman', 'Sawahlunto', 'Solok', 'Agam'],
    'Riau': ['Pekanbaru', 'Dumai', 'Kampar', 'Rokan Hulu', 'Bengkalis', 'Siak', 'Indragiri Hulu'],
    'Kepulauan Riau': ['Batam', 'Tanjungpinang', 'Bintan', 'Karimun', 'Lingga', 'Natuna'],
    'Jambi': ['Jambi', 'Sungai Penuh', 'Muaro Jambi', 'Batanghari', 'Bungo', 'Tebo'],
    'Sumatera Selatan': ['Palembang', 'Lubuklinggau', 'Pagar Alam', 'Prabumulih', 'Ogan Ilir', 'Banyuasin', 'Musi Banyuasin'],
    'Bangka Belitung': ['Pangkalpinang', 'Bangka', 'Belitung', 'Bangka Barat', 'Bangka Tengah', 'Belitung Timur'],
    'Bengkulu': ['Bengkulu', 'Rejang Lebong', 'Kepahiang', 'Mukomuko', 'Seluma'],
    'Lampung': ['Bandar Lampung', 'Metro', 'Lampung Selatan', 'Lampung Tengah', 'Lampung Utara', 'Pringsewu'],
    'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'],
    'Jawa Barat': ['Bandung', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon', 'Depok', 'Sukabumi', 'Tasikmalaya', 'Banjar', 'Garut', 'Karawang', 'Purwakarta', 'Subang', 'Sumedang', 'Indramayu', 'Kuningan', 'Majalengka', 'Ciamis'],
    'Banten': ['Serang', 'Cilegon', 'Tangerang', 'Tangerang Selatan', 'Lebak', 'Pandeglang'],
    'Jawa Tengah': ['Semarang', 'Surakarta (Solo)', 'Magelang', 'Pekalongan', 'Salatiga', 'Tegal', 'Banyumas', 'Cilacap', 'Kudus', 'Jepara', 'Klaten', 'Boyolali', 'Sukoharjo', 'Purwokerto', 'Kebumen'],
    'DI Yogyakarta': ['Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo', 'Gunungkidul'],
    'Jawa Timur': ['Surabaya', 'Malang', 'Batu', 'Blitar', 'Kediri', 'Madiun', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Sidoarjo', 'Gresik', 'Jember', 'Banyuwangi', 'Bojonegoro', 'Lamongan', 'Tuban'],
    'Bali': ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Buleleng', 'Klungkung', 'Karangasem', 'Bangli', 'Jembrana'],
    'Nusa Tenggara Barat': ['Mataram', 'Bima', 'Lombok Barat', 'Lombok Tengah', 'Lombok Timur', 'Sumbawa', 'Dompu'],
    'Nusa Tenggara Timur': ['Kupang', 'Ende', 'Maumere', 'Sikka', 'Manggarai', 'Flores Timur', 'Sumba Timur', 'Belu'],
    'Kalimantan Barat': ['Pontianak', 'Singkawang', 'Kubu Raya', 'Sambas', 'Sanggau', 'Sintang', 'Ketapang', 'Mempawah', 'Landak'],
    'Kalimantan Tengah': ['Palangka Raya', 'Kotawaringin Timur', 'Kotawaringin Barat', 'Kapuas', 'Barito Selatan'],
    'Kalimantan Selatan': ['Banjarmasin', 'Banjarbaru', 'Banjar', 'Barito Kuala', 'Tanah Laut', 'Tapin', 'Hulu Sungai Selatan'],
    'Kalimantan Timur': ['Samarinda', 'Balikpapan', 'Bontang', 'Kutai Kartanegara', 'Kutai Timur', 'Berau', 'Paser'],
    'Kalimantan Utara': ['Tarakan', 'Bulungan', 'Nunukan', 'Malinau', 'Tana Tidung'],
    'Sulawesi Utara': ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu', 'Minahasa', 'Minahasa Utara'],
    'Gorontalo': ['Gorontalo', 'Boalemo', 'Bone Bolango', 'Pohuwato', 'Gorontalo Utara'],
    'Sulawesi Tengah': ['Palu', 'Donggala', 'Poso', 'Morowali', 'Banggai', 'Parigi Moutong'],
    'Sulawesi Barat': ['Mamuju', 'Polewali Mandar', 'Majene', 'Mamasa', 'Pasangkayu'],
    'Sulawesi Selatan': ['Makassar', 'Parepare', 'Palopo', 'Gowa', 'Maros', 'Bone', 'Bulukumba', 'Sinjai', 'Takalar', 'Wajo'],
    'Sulawesi Tenggara': ['Kendari', 'Baubau', 'Konawe', 'Kolaka', 'Muna', 'Buton'],
    'Maluku': ['Ambon', 'Tual', 'Maluku Tengah', 'Seram Bagian Barat', 'Buru', 'Kepulauan Aru'],
    'Maluku Utara': ['Ternate', 'Tidore Kepulauan', 'Halmahera Utara', 'Halmahera Selatan', 'Halmahera Barat'],
    'Papua': ['Jayapura', 'Sentani', 'Keerom', 'Sarmi', 'Biak Numfor'],
    'Papua Barat': ['Manokwari', 'Sorong', 'Fakfak', 'Kaimana', 'Teluk Bintuni'],
    'Papua Barat Daya': ['Sorong', 'Raja Ampat', 'Sorong Selatan', 'Maybrat', 'Tambrauw'],
    'Papua Selatan': ['Merauke', 'Boven Digoel', 'Mappi', 'Asmat'],
    'Papua Tengah': ['Nabire', 'Mimika (Timika)', 'Paniai', 'Puncak Jaya', 'Dogiyai'],
    'Papua Pegunungan': ['Jayawijaya (Wamena)', 'Yahukimo', 'Tolikara', 'Pegunungan Bintang'],
};

export const PROVINCES = Object.keys(REGIONS);

export function citiesOf(province: string): string[] {
    return REGIONS[province] ?? [];
}
