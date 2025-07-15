export default function DashboardPageTitle({
    title,
    className = "",
}: {
    title: string;
    className?: string;
}) {
    return (
        <h1
            className={className}
            style={{
                color: 'var(--OnBackground, #000)',
                fontFamily: 'Inter',
                fontSize: '24px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '20px',
            }}
        >
            {title}
        </h1>
    );
}
