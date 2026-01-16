/**
 * Simple browser fingerprinting and IP detection for abuse prevention.
 * Note: MAC address cannot be accessed from a web browser for security reasons.
 * We use a combination of browser characteristics to create a unique device hash.
 */

export const getFingerprint = async (): Promise<string> => {
    // Collect browser characteristics
    const components = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset(),
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        (navigator as any).deviceMemory || 'unknown',
        (navigator as any).hardwareConcurrency || 'unknown',
        // Canvas fingerprinting (simple version)
        (() => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return 'no-canvas';
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = '#f60';
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = '#069';
                ctx.fillText('Affimate_Security_Check', 2, 15);
                ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
                ctx.fillText('Affimate_Security_Check', 4, 17);
                return canvas.toDataURL();
            } catch (e) {
                return 'error-canvas';
            }
        })()
    ];

    // Create a simple hash from the components
    const str = components.join('||');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16);
};

export const getIPAddress = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to get IP:', error);
        return 'unknown-ip';
    }
};
