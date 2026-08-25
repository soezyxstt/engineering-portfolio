3D CAD MODELS — drop zone
=========================

Put your web-ready model files here as .glb (binary glTF).

How to populate a model:
1. Export your CAD part/assembly to glTF/GLB:
     - SolidWorks: File > Save As > glTF (.gltf/.glb)  [or via the "Extended Reality" / 3DEXPERIENCE export]
     - Fusion 360: right-click body/component > Save As Mesh, or use a glTF export add-in
     - Onshape: Export > GLTF
     - Blender (universal fallback): File > Export > glTF 2.0 (.glb)
   Prefer .glb (single self-contained binary). Apply materials/colors before export so they carry over.
2. Name the file to match the model id in /data/cad.json, e.g.  fess-rotor.glb
3. In /data/cad.json set:
       "model": "/models/fess-rotor.glb"
   (optionally add a rendered "poster" image — see /public/cad/README.txt)
4. Adjust the "hotspots" positions (model-space x,y,z) to point at real features.

Tips:
- Keep files small (decimate heavy meshes; < ~15 MB loads best on the web).
- The viewer auto-centers and auto-fits the model, so exact scale/origin isn't critical.
- Only GLB/glTF is wired up. STEP/STL would need an extra loader — ask if you need it.
