# Batch HLS encode for all site videos. Output: public/video/hls/<slug>/
$ErrorActionPreference = 'Stop'
$script = 'C:/Users/lukas/.claude/plugins/video-hls/skills/video-hls/scripts/hls.mjs'
$src    = 'C:/Users/lukas/WebstormProjects/dlv-homepage/public/video'
$out    = 'C:/Users/lukas/WebstormProjects/dlv-homepage/public/video/hls'

# ZP-AR first as canary (short, exercises AV1 + NVENC + no-audio fallback).
$jobs = @(
  @{ in = 'ZP-AR.mp4';                  args = @('--mode','content','--codecs','avc,av1','--gpu','--poster','5','--force') },
  @{ in = 'ZP-UAV.mp4';                 args = @('--mode','content','--codecs','avc,av1','--gpu','--poster','10','--force') },
  @{ in = 'A look into the future of the Wemding time pyramid - Aerial photogrammetry and visualization.mp4'; args = @('--mode','content','--codecs','avc,av1','--gpu','--poster','10','--name','zp-uav-en','--force') },
  @{ in = 'Sophienkirche-Prototyp.mp4'; args = @('--mode','content','--codecs','avc,av1','--gpu','--ladder','720,480,360','--poster','10','--force') },
  @{ in = 'LANGZEITDESIGN.mp4';         args = @('--mode','content','--codecs','avc,hevc','--gpu','--poster','30','--name','langzeitdesign','--force') },
  @{ in = 'LONG TERM DESIGN NEW.mp4';   args = @('--mode','content','--codecs','avc,hevc','--gpu','--poster','30','--name','long-term-design-en','--force') }
)

foreach ($j in $jobs) {
  $t0 = Get-Date
  Write-Output "==== START $($j.in) @ $($t0.ToString('HH:mm:ss')) ===="
  $a = $j.args
  & node $script "$src/$($j.in)" $out @a
  if ($LASTEXITCODE -ne 0) { Write-Output "!!!! FAILED $($j.in) exit=$LASTEXITCODE"; exit 1 }
  Write-Output "==== DONE  $($j.in) in $([math]::Round(((Get-Date) - $t0).TotalMinutes,1)) min ===="
}
Write-Output 'ALL DONE'
