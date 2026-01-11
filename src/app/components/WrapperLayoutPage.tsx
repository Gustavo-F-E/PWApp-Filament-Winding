// components/WrapperLayoutPage.tsx
interface WrapperLayoutPageProps {
    headerContent: React.ReactNode;
    mainContent: React.ReactNode;
    asideContent?: React.ReactNode;
}

export default function WrapperLayoutPage({
    headerContent,
    mainContent,
    asideContent,
}: WrapperLayoutPageProps) {
    return (
        <div className="h-full flex flex-col">
            {/* Header - contenido personalizado de cada página */}
            <div className="hidden lg:flex items-center justify-center bg-blue-300 h-[25vh] min-h-[192px] flex-shrink-0">
                {headerContent}
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex min-h-0">
                <main className="flex-1 bg-blue-50 overflow-auto">
                    <div className="p-4 lg:p-6 min-h-full">{mainContent}</div>
                </main>

                {asideContent && (
                    <aside className="hidden lg:block w-80 bg-blue-100 overflow-auto flex-shrink-0">
                        <div className="p-4 lg:p-6 h-full">{asideContent}</div>
                    </aside>
                )}
            </div>
        </div>
    );
}
