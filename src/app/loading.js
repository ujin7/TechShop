export default function Loading() {
  return (
    <div style={{ padding: '24px 0' }}>
      <div className="app-container" style={{ display: 'grid', gap: 16 }}>
        <div style={{ height: 320, borderRadius: 16, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 260,
                borderRadius: 12,
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
