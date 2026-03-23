import {ImageResponse} from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const {searchParams} = new URL(req.url);

  const title = searchParams.get('title') || 'Ferry Hinardi';
  const description = searchParams.get('description') || 'Software Engineer | React & TypeScript Expert';
  const path = searchParams.get('path') || '/';
  const siteUrl = 'ferryhinardi.com';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top: Site name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            FH
          </div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#94a3b8',
            }}
          >
            Ferry Hinardi
          </span>
        </div>

        {/* Middle: Title + Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: '28px',
                color: '#94a3b8',
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom: URL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              color: '#64748b',
            }}
          >
            {siteUrl}{path !== '/' ? path : ''}
          </span>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                background: '#3b82f6',
              }}
            />
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                background: '#8b5cf6',
              }}
            />
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                background: '#06b6d4',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
