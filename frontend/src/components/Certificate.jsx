import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share2, Linkedin, Award, Star, Calendar } from 'lucide-react';

const Certificate = ({ project, user, onClose }) => {
  const canvasRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const drawCertificate = (ctx, width, height) => {
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0e27');
    bgGrad.addColorStop(0.5, '#111638');
    bgGrad.addColorStop(1, '#0a0e27');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative border
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Inner border
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Corner decorations
    const corners = [
      [50, 50], [width - 50, 50],
      [50, height - 50], [width - 50, height - 50]
    ];
    corners.forEach(([x, y]) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 40);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
      grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - 40, y - 40, 80, 80);
    });

    // Top decorative line
    const lineGrad = ctx.createLinearGradient(width * 0.2, 0, width * 0.8, 0);
    lineGrad.addColorStop(0, 'rgba(139, 92, 246, 0)');
    lineGrad.addColorStop(0.5, '#8B5CF6');
    lineGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, 100);
    ctx.lineTo(width * 0.85, 100);
    ctx.stroke();

    // Logo/Brand
    ctx.fillStyle = '#8B5CF6';
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SANAPATH AI ✦', width / 2, 85);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE', width / 2, 160);

    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#06B6D4';
    ctx.fillText('OF COMPLETION', width / 2, 188);

    // Divider
    const divGrad = ctx.createLinearGradient(width * 0.3, 0, width * 0.7, 0);
    divGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
    divGrad.addColorStop(0.5, '#06B6D4');
    divGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.25, 210);
    ctx.lineTo(width * 0.75, 210);
    ctx.stroke();

    // "This certifies that"
    ctx.fillStyle = '#8899bb';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('This is to certify that', width / 2, 250);

    // User name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Inter, system-ui, sans-serif';
    const displayName = user?.name || user?.email?.split('@')[0] || 'Student';
    ctx.fillText(displayName, width / 2, 300);

    // Name underline
    const nameWidth = ctx.measureText(displayName).width;
    const nameGrad = ctx.createLinearGradient(width / 2 - nameWidth / 2, 0, width / 2 + nameWidth / 2, 0);
    nameGrad.addColorStop(0, 'rgba(139, 92, 246, 0)');
    nameGrad.addColorStop(0.5, '#8B5CF6');
    nameGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.strokeStyle = nameGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - nameWidth / 2 - 20, 312);
    ctx.lineTo(width / 2 + nameWidth / 2 + 20, 312);
    ctx.stroke();

    // "has successfully completed"
    ctx.fillStyle = '#8899bb';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('has successfully completed the project', width / 2, 350);

    // Project title
    ctx.fillStyle = '#06B6D4';
    ctx.font = 'bold 26px Inter, system-ui, sans-serif';
    // Wrap title if too long
    const maxWidth = width - 160;
    const title = project?.title || 'AI Project';
    if (ctx.measureText(title).width > maxWidth) {
      const words = title.split(' ');
      let line = '';
      let y = 390;
      words.forEach(word => {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line.trim(), width / 2, y);
          line = word + ' ';
          y += 35;
        } else {
          line = test;
        }
      });
      ctx.fillText(line.trim(), width / 2, y);
    } else {
      ctx.fillText(title, width / 2, 395);
    }

    // Tech stack
    const techs = project?.tech_stack?.join(' • ') || '';
    ctx.fillStyle = '#667799';
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText(techs, width / 2, 435);

    // Description
    ctx.fillStyle = '#8899bb';
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText('Demonstrating proficiency in AI development through', width / 2, 475);
    ctx.fillText('the SanaPath AI platform and AI-Sana ecosystem', width / 2, 495);

    // Date and ID
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const certId = `SP-${Date.now().toString(36).toUpperCase()}`;

    // Bottom section
    ctx.fillStyle = '#667799';
    ctx.font = '13px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Date: ${date}`, 80, height - 100);
    ctx.fillText(`Certificate ID: ${certId}`, 80, height - 80);

    ctx.textAlign = 'right';
    ctx.fillText('sanapath-ai.netlify.app', width - 80, height - 100);
    ctx.fillText('AI-Sana Ecosystem', width - 80, height - 80);

    // Bottom decorative line
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height - 120);
    ctx.lineTo(width * 0.85, height - 120);
    ctx.stroke();

    // Stars decoration
    ctx.fillStyle = '#8B5CF6';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('★  ★  ★', width / 2, height - 55);
  };

  const handleDownload = () => {
    setDownloading(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 900;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    drawCertificate(ctx, width, height);

    // Download as PNG
    const link = document.createElement('a');
    link.download = `SanaPath-Certificate-${project?.title?.replace(/[^a-zA-Z0-9]/g, '-') || 'project'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloading(false);
  };

  const handleShareLinkedIn = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 600;
    drawCertificate(ctx, 900, 600);

    const text = `🎓 I just earned my SanaPath AI Certificate!\n\n✅ Completed: "${project?.title}"\n🛠 Tech: ${project?.tech_stack?.join(', ')}\n\nProud to be part of the AI-Sana ecosystem with 60,000+ students!\n\nhttps://sanapath-ai.netlify.app\n\n#SanaPathAI #Certificate #AI #MachineLearning #BuildInPublic`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://sanapath-ai.netlify.app')}`;
    navigator.clipboard.writeText(text);
    window.open(url, '_blank', 'width=600,height=600');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl card-glass rounded-2xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-deep-blue-700 flex items-center justify-between bg-gradient-to-r from-neon-purple-500/10 to-cyber-blue/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">🎓 Congratulations!</h3>
                <p className="text-sm text-deep-blue-400">You've earned a certificate of completion</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-deep-blue-700 text-deep-blue-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Certificate Preview */}
          <div className="p-6 bg-deep-blue-950/50">
            <div className="relative rounded-xl overflow-hidden border border-deep-blue-700/50 shadow-2xl">
              <canvas
                ref={canvasRef}
                width={900}
                height={600}
                className="w-full h-auto"
                style={{ background: '#0a0e27' }}
              />
              {/* Auto-draw on mount */}
              <AutoDraw canvasRef={canvasRef} drawFn={drawCertificate} />
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-deep-blue-700 flex flex-wrap gap-3 justify-center">
            <motion.button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Downloading...' : 'Download PNG'}
            </motion.button>

            <motion.button
              onClick={handleShareLinkedIn}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0077B5] text-white font-medium hover:bg-[#0077B5]/80 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Linkedin className="w-5 h-5" />
              Share on LinkedIn
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper component to auto-draw certificate on mount
const AutoDraw = ({ canvasRef, drawFn }) => {
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = 900;
    canvasRef.current.height = 600;
    drawFn(ctx, 900, 600);
  }
  return null;
};

export default Certificate;
