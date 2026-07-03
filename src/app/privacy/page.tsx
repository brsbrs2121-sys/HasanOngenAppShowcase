import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[100svh] bg-background text-foreground p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl min-w-0">
        <CardHeader className="min-w-0">
          <div className="flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <CardTitle className="text-2xl">Gizlilik Politikası</CardTitle>
              <CardDescription>Son Güncelleme: 9 Aralık 2025</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-w-0">
          <ScrollArea className="h-[60vh] w-full">
           
            <div className="min-w-0 pr-4">
              <div className="space-y-6 text-sm text-muted-foreground break-words [overflow-wrap:anywhere] [word-break:break-word]">
                <p>
                  Bu gizlilik politikası, mobil uygulamamızı kullandığınızda kişisel verilerinizi nasıl topladığımızı,
                  kullandığımızı, paylaştığımızı ve koruduğumuzu açıklar. Uygulamayı kullanarak bu politikayı kabul etmiş sayılırsınız.
                </p>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">1. Veri Sorumlusu</h3>
                  <p>
                    Sorumlu: Hasan Öngen
                    <br />
                    İletişim:{' '}
                    <a className="text-foreground underline" href="mailto:hasanbey757@gmail.com">
                      hasanbey757@gmail.com
                    </a>
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">2. Topladığımız Veriler</h3>
                  <p>Uygulama kapsamında aşağıdaki verileri toplayabiliriz:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Ad ve Soyad:</strong> Hesabın oluşturulması ve profilde görüntüleme için.</li>
                    <li><strong>Telefon Numarası:</strong> SMS/OTP ile kimlik doğrulama ve hesap güvenliği için.</li>
                    <li><strong>Profil Fotoğrafı (isteğe bağlı):</strong> Kamera/Fotoğraf Kitaplığı izni verilirse yüklenir.</li>
                    <li><strong>Bildirim Belirteci (APNs/FCM token):</strong> İzin vermeniz hâlinde anlık bildirim gönderebilmek için.</li>
                    <li>
                      <strong>Kullanım/Analitik Verileri:</strong> Ekran görüntüleme ve temel etkileşim olayları gibi
                      anonim/psödonomize kullanım verileri (Firebase Analytics).
                    </li>
                  </ul>
                  <p>
                    <strong>Toplamadığımız veriler:</strong> Üçüncü taraf reklam/IDFA verileri, çökme (crash) ve performans verileri
                    (ayrı bir SDK ile), SMS/e-posta içerikleri.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">3. Verilerin Kullanım Amaçları</h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Uygulama İşlevselliği:</strong> Hesap oluşturma ve yönetimi, kimlik doğrulama (SMS/OTP), müşteri desteği.</li>
                    <li><strong>Güvenlik:</strong> Kötüye kullanımın önlenmesi ve oturum güvenliği.</li>
                    <li><strong>Analitik:</strong> Uygulamanın kullanımını anlamak ve iyileştirmek (Firebase Analytics – reklam kişiselleştirme sinyalleri kapalı).</li>
                    <li><strong>Bildirimler:</strong> Uygulama içi işlemler ve güncellemeler hakkında bilgilendirme (izin verdiğinizde).</li>
                  </ul>
                  <p>Veriler pazarlama/yeniden hedefleme amacıyla kullanılmaz; üçüncü taraf reklam gösterimi yapılmaz.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">4. Üçüncü Taraf Hizmetleri</h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>
                      <strong>Google Firebase (Google LLC):</strong> Kimlik (Auth – SMS doğrulama), Bildirim (Messaging),
                      Analitik (Analytics). Reklam kişiselleştirme sinyalleri devre dışıdır.
                    </li>
                    <li>
                      <strong>Google reCAPTCHA:</strong> Bazı işlemlerde bot ve kötüye kullanımı engellemek için kullanılır.
                      Daha fazla bilgi:{' '}
                      <a className="text-foreground underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                        Google Gizlilik Politikası
                      </a>{' '}
                      ve{' '}
                      <a className="text-foreground underline" href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
                        Hizmet Şartları
                      </a>.
                    </li>
                    <li>
                      <strong>Apple (APNs/TestFlight):</strong> Bildirim iletimi ve beta test süreçleri Apple’ın kendi şartları kapsamında yürütülür.
                    </li>
                  </ul>
                  <p>Yasal zorunluluklar dışında kişisel verileriniz üçüncü taraflara satılmaz veya reklam amaçlı paylaşılmaz.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">5. İzleme (Tracking) ve Reklam</h3>
                  <p>Uygulama, App Tracking Transparency izni istemez ve IDFA kullanmaz. Üçüncü taraf reklam gösterimi yoktur.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">6. Veri Saklama Süreleri</h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Hesap verileri:</strong> Hesap aktif olduğu sürece; hesabın silinmesi talebinde silinir/anonymize edilir.</li>
                    <li><strong>Analitik verileri:</strong> Firebase varsayılan saklama politikalarına uygun sürelerde.</li>
                    <li><strong>Bildirim belirteci:</strong> Bildirim hizmeti için gerekli olduğu sürece.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">7. Güvenlik</h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Sunucu ile iletişim TLS/HTTPS ile şifrelenir.</li>
                    <li>Erişim kontrolleri ve yetki sınırlamaları uygulanır.</li>
                    <li>Verilere yalnızca yetkili personel erişebilir.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">8. Kullanıcı Hakları</h3>
                  <p>
                    KVKK/GDPR kapsamında verilerinize erişme, düzeltme, silme, işleme kısıtlama, itiraz ve veri taşınabilirliği
                    haklarına sahipsiniz. Talepleriniz için bize e-posta gönderebilirsiniz:
                    <br />
                    <a className="text-foreground underline" href="mailto:hasanbey757@gmail.com">
                      hasanbey757@gmail.com
                    </a>
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">9. Uluslararası Aktarım</h3>
                  <p>Google ve Apple altyapıları nedeniyle veriler yurtdışına aktarılabilir.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">10. Çocukların Gizliliği</h3>
                  <p>Uygulama çocuklara yönelik değildir ve bilerek çocuklardan veri toplamayız.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">11. Politika Değişiklikleri</h3>
                  <p>Bu politika güncellenebilir. Güncel sürümü uygulama içinden görüntüleyebilirsiniz.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">12. İletişim</h3>
                  <p>
                    Gizlilikle ilgili tüm sorularınız için bize ulaşın:
                    <br />
                    E-posta:{' '}
                    <a className="text-foreground underline" href="mailto:hasanbey757@gmail.com">
                      hasanbey757@gmail.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
