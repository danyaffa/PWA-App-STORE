// src/pages/Safety.jsx
import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { PIPELINE_STAGES } from '../utils/data.js'

const SEV_COLOR = { pass:'var(--accent)', medium:'var(--warn)', critical:'var(--danger)', high:'#ff8c4d' }

export default function Safety() {
  const [open, setOpen]   = useState(null)
  const [risk, setRisk]   = useState(12)

  const decision = risk < 30 ? 'ALLOW' : risk < 60 ? 'REVIEW' : 'BLOCK'
  const decColor = { ALLOW:'var(--accent)', REVIEW:'var(--warn)', BLOCK:'var(--danger)' }[decision]
  const decBg    = { ALLOW:'rgba(0,229,160,.08)', REVIEW:'rgba(255,184,77,.08)', BLOCK:'rgba(255,77,109,.08)' }[decision]
  const decBdr   = { ALLOW:'rgba(0,229,160,.25)', REVIEW:'rgba(255,184,77,.25)', BLOCK:'rgba(255,77,109,.25)' }[decision]

  return (
    <>
      <Nav />
      <div className="page-wrap">
        <div className="section-label">How It Works</div>
        <h1 className="section-title display">The 6-Layer AI<br />Safety Pipeline</h1>
        <p className="section-sub" style={{marginBottom:60}}>Every submission runs through all six stages before a single user can install it. Transparent decisions, explainable results, zero mystery rejections.</p>

        {/* Pipeline */}
        <div style={{marginBottom:80}}>
          {PIPELINE_STAGES.map((s, i) => (
            <div key={s.num} style={{display:'flex',alignItems:'flex-start',gap:24,padding:'28px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}} onClick={() => setOpen(open===i?null:i)}>
              <div style={{width:48,height:48,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontSize:'0.85rem',flexShrink:0,border:'2px solid var(--accent)',transition:'all .3s',background: open===i?'var(--accent)':'transparent',color: open===i?'#0a0a0f':'var(--accent)'}}>{s.num}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6,flexWrap:'wrap',gap:8}}>
                  <strong style={{fontSize:'1.05rem'}}>{s.title}</strong>
                  <span className={`badge badge-${s.badge}`}>{s.badge.toUpperCase()}</span>
                </div>
                <p style={{color:'var(--muted)',fontSize:'0.87rem',lineHeight:1.6}}>{s.desc}</p>
                {open === i && (
                  <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:8}}>
                    {s.findings.map((f, j) => (
                      <div key={j} style={{display:'flex',alignItems:'center',gap:10,background:'var(--bg)',borderRadius:8,padding:'10px 14px',fontSize:'0.82rem',fontFamily:'var(--font-mono)'}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:SEV_COLOR[f.sev]||'var(--muted)',flexShrink:0}} />
                        {f.msg}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Risk meter */}
        <div className="card" style={{padding:48,marginBottom:80}}>
          <div className="section-label">Live Risk Simulator</div>
          <h2 className="section-title display" style={{marginBottom:8}}>Drag to Simulate</h2>
          <p style={{color:'var(--muted)',fontSize:'0.88rem',marginBottom:32}}>See how different findings change the ALLOW / REVIEW / BLOCK decision in real time.</p>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:40,alignItems:'center',flexWrap:'wrap'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'5rem',lineHeight:1,color:decColor,transition:'color .4s'}}>{risk}</div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginTop:6}}>/ 100 risk</div>
            </div>
            <div>
              <div style={{height:14,borderRadius:100,background:'var(--bg)',overflow:'hidden',marginBottom:8}}>
                <div style={{height:'100%',background:'linear-gradient(90deg,var(--accent),var(--warn),var(--danger))',borderRadius:100,width:`${risk}%`,transition:'width .5s'}} />
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'var(--muted)',fontFamily:'var(--font-mono)',marginBottom:16}}>
                <span>0 — ALLOW</span><span>30 — REVIEW</span><span>60 — BLOCK</span>
              </div>
              <input type="range" min={0} max={100} value={risk} onChange={e=>setRisk(+e.target.value)} style={{width:'100%',accentColor:'var(--accent)'}} />
            </div>
          </div>
          <div style={{background:decBg,border:`1px solid ${decBdr}`,borderRadius:'var(--radius-md)',padding:'20px 28px',marginTop:28,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
            <div>
              <strong style={{color:decColor,fontSize:'1rem'}}>
                {decision==='ALLOW'?'✅ ALLOW — Ready to Publish':decision==='REVIEW'?'⚠️ REVIEW — Human Check Required':'🚫 BLOCK — Critical Issues Found'}
              </strong>
              <p style={{color:'var(--muted)',fontSize:'0.82rem',marginTop:4}}>
                {decision==='ALLOW'?'No critical issues. Cleared for publish.':decision==='REVIEW'?'Findings require Trust Ops review before publish.':'Critical security findings prevent publish. Fixes required.'}
              </p>
            </div>
          </div>
        </div>

        {/* Scoring table */}
        <div className="section-label">Scoring Reference</div>
        <h2 className="section-title display" style={{marginBottom:32}}>How Points Are Calculated</h2>
        <table style={{width:'100%',borderCollapse:'collapse',marginBottom:80}}>
          <thead>
            <tr>
              {['Finding Type','Examples','Severity','Points'].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'12px 16px',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)',borderBottom:'1px solid var(--border)'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Malware / credential theft',     'Known malware, keylogger, phishing form',          'CRITICAL', '+60', 'var(--danger)'],
              ['Crypto-miner / drive-by',        'Coinhive bytecode, forced file download',          'CRITICAL', '+60', 'var(--danger)'],
              ['XSS sinks / unsafe eval',        'innerHTML with user input, eval() on remote data', 'HIGH',     '+25', '#ff8c4d'],
              ['Suspicious redirect chains',     '3+ hops, undeclared final domain',                 'HIGH',     '+25', '#ff8c4d'],
              ['Medium CVE / weak CSP',          'Non-RCE CVE, missing Content-Security-Policy',    'MEDIUM',   '+10', 'var(--warn)'],
              ['Missing privacy / ToS',          'No privacy URL, no contact email',                 'MEDIUM',   '+10', 'var(--warn)'],
              ['Mixed content / outdated lib',   'HTTP resource on HTTPS, lib 2+ majors old',        'LOW',      '+3',  'var(--accent2)'],
              ['Trusted publisher bonus',        '8+ months, 0 strikes, 3+ clean versions',         '—',        '-10', 'var(--accent)'],
            ].map(([type,ex,sev,pts,c])=>(
              <tr key={type} style={{}}>
                <td style={{padding:'14px 16px',fontSize:'0.87rem',borderBottom:'1px solid rgba(42,42,58,.5)'}}>{type}</td>
                <td style={{padding:'14px 16px',fontSize:'0.82rem',color:'var(--muted)',borderBottom:'1px solid rgba(42,42,58,.5)'}}>{ex}</td>
                <td style={{padding:'14px 16px',borderBottom:'1px solid rgba(42,42,58,.5)'}}><span className="badge" style={{background:`${c}22`,color:c}}>{sev}</span></td>
                <td style={{padding:'14px 16px',fontFamily:'var(--font-mono)',fontSize:'0.82rem',color:c,fontWeight:700,borderBottom:'1px solid rgba(42,42,58,.5)'}}>{pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  )
}
