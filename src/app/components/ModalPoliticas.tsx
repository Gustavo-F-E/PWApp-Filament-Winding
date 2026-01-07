// app/components/ModalPoliticas.tsx
'use client'

import { useState, useEffect } from 'react'

interface ModalPoliticasProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
  showAcceptButton?: boolean
}

export default function ModalPoliticas({ 
  isOpen, 
  onClose, 
  onAccept,
  showAcceptButton = false 
}: ModalPoliticasProps) {
  const [hasAccepted, setHasAccepted] = useState(false)

  // Cerrar modal con Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'relative'
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
    }
  }, [isOpen])

  const handleAccept = () => {
    setHasAccepted(true)
    if (onAccept) {
      onAccept()
    }
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal */}
        <div 
          className="
            bg-white rounded-xl shadow-2xl w-full max-w-4xl 
            max-h-[90vh] overflow-y-auto relative
          "
          style={{
            backgroundColor: 'white',
            backgroundImage: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Términos de Servicio y Política de Privacidad
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Cerrar modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 bg-white">
            <div className="prose prose-lg max-w-none">
              {/* Términos de Servicio */}
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  TÉRMINOS DE SERVICIO
                </h3>
                <p className="text-gray-700 mb-4">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">1. Aceptación de los Términos</h4>
                <p className="text-gray-700 mb-4">
                  Al acceder y utilizar Filament Path Generator ("el Servicio"), usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">2. Descripción del Servicio</h4>
                <p className="text-gray-700 mb-4">
                  Filament Path Generator es una aplicación web diseñada para generar y visualizar trayectorias de filamentos para impresión 3D. El Servicio se proporciona "tal cual" y "según disponibilidad".
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">3. Cuentas de Usuario</h4>
                <p className="text-gray-700 mb-4">
                  Para utilizar ciertas funciones del Servicio, puede ser necesario crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y de restringir el acceso a su dispositivo.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">4. Propiedad Intelectual</h4>
                <p className="text-gray-700 mb-4">
                  El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Filament Path Generator y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">5. Limitación de Responsabilidad</h4>
                <p className="text-gray-700 mb-4">
                  En ningún caso Filament Path Generator será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluidos, entre otros, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">6. Modificaciones al Servicio</h4>
                <p className="text-gray-700 mb-4">
                  Nos reservamos el derecho de modificar o discontinuar el Servicio (o cualquier parte del mismo) con o sin previo aviso. No seremos responsables ante usted ni ante ningún tercero por cualquier modificación, suspensión o interrupción del Servicio.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">7. Ley Aplicable</h4>
                <p className="text-gray-700 mb-4">
                  Estos Términos se regirán e interpretarán de acuerdo con las leyes de Argentina, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
                </p>
              </section>

              {/* Política de Privacidad */}
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  POLÍTICA DE PRIVACIDAD
                </h3>
                <p className="text-gray-700 mb-4">
                  Esta Política de Privacidad describe cómo se recopila, utiliza y comparte su información personal cuando utiliza nuestro Servicio.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">1. Información que Recopilamos</h4>
                <p className="text-gray-700 mb-4">
                  Recopilamos la información que usted nos proporciona directamente, incluyendo:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Información de registro (nombre, email)</li>
                  <li>Información de perfil</li>
                  <li>Contenido que crea o comparte</li>
                  <li>Comunicaciones con nosotros</li>
                </ul>

                <h4 className="text-lg font-medium text-gray-900 mb-2">2. Uso de la Información</h4>
                <p className="text-gray-700 mb-4">
                  Utilizamos la información recopilada para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Proveer, operar y mantener nuestro Servicio</li>
                  <li>Mejorar, personalizar y expandir nuestro Servicio</li>
                  <li>Comunicarnos con usted</li>
                  <li>Prevenir el fraude</li>
                </ul>

                <h4 className="text-lg font-medium text-gray-900 mb-2">3. Compartir Información</h4>
                <p className="text-gray-700 mb-4">
                  No vendemos su información personal a terceros. Podemos compartir información en las siguientes situaciones:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Con su consentimiento</li>
                  <li>Para cumplir con la ley</li>
                  <li>Proteger derechos y seguridad</li>
                  <li>Con proveedores de servicios que trabajan en nuestro nombre</li>
                </ul>

                <h4 className="text-lg font-medium text-gray-900 mb-2">4. Seguridad de los Datos</h4>
                <p className="text-gray-700 mb-4">
                  Implementamos medidas de seguridad razonables para proteger su información personal. Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">5. Sus Derechos</h4>
                <p className="text-gray-700 mb-4">
                  Dependiendo de su ubicación, puede tener ciertos derechos respecto a su información personal, incluidos:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Acceso a sus datos personales</li>
                  <li>Corrección de datos inexactos</li>
                  <li>Eliminación de sus datos</li>
                  <li>Restricción del procesamiento</li>
                  <li>Portabilidad de datos</li>
                </ul>

                <h4 className="text-lg font-medium text-gray-900 mb-2">6. Cookies</h4>
                <p className="text-gray-700 mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro Servicio. Puede configurar su navegador para rechazar todas las cookies, pero algunas funciones del Servicio pueden no funcionar correctamente.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mb-2">7. Cambios a esta Política</h4>
                <p className="text-gray-700 mb-4">
                  Podemos actualizar nuestra Política de Privacidad periódicamente. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.
                </p>
              </section>

              {/* Sección de Contacto */}
              <section className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Contacto</h4>
                <p className="text-gray-700">
                  Si tiene preguntas sobre estos Términos o la Política de Privacidad, contáctenos en:
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Email:</strong> contacto@filamentpathgenerator.com
                </p>
                <p className="text-gray-700">
                  <strong>Sitio web:</strong> www.filamentpathgenerator.com
                </p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-gray-200 p-4 bg-white rounded-b-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 text-center sm:text-left">
                Al utilizar nuestro servicio, usted acepta estos términos y políticas.
              </div>
              
              <div className="flex gap-3">
                {showAcceptButton && (
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Aceptar Términos
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}