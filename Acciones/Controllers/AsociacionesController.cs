using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;

namespace Acciones.Controllers
{
    public class AsociacionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public AsociacionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Asociaciones
        public async Task<IActionResult> Index()
        {
            var dbAccionesContext = _context.Asociaciones.Include(a => a.Calle).Include(a => a.Colonia);
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Asociaciones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var asociacione = await _context.Asociaciones
                .Include(a => a.Calle)
                .Include(a => a.Colonia)
                .FirstOrDefaultAsync(m => m.AsociacionId == id);
            if (asociacione == null)
            {
                return NotFound();
            }

            return View(asociacione);
        }

        // GET: Asociaciones/Create
        public IActionResult Create()
        {
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle");
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            return View();
        }

        // POST: Asociaciones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("AsociacionId,Nombre,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Distrito,Seccion,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Asociacione asociacione)
        {
            if (ModelState.IsValid)
            {
                _context.Add(asociacione);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", asociacione.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", asociacione.ColoniaId);
            return View(asociacione);
        }

        // GET: Asociaciones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var asociacione = await _context.Asociaciones.FindAsync(id);
            if (asociacione == null)
            {
                return NotFound();
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", asociacione.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", asociacione.ColoniaId);
            return View(asociacione);
        }

        // POST: Asociaciones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("AsociacionId,Nombre,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Distrito,Seccion,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Asociacione asociacione)
        {
            if (id != asociacione.AsociacionId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(asociacione);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AsociacioneExists(asociacione.AsociacionId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", asociacione.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", asociacione.ColoniaId);
            return View(asociacione);
        }

        // GET: Asociaciones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var asociacione = await _context.Asociaciones
                .Include(a => a.Calle)
                .Include(a => a.Colonia)
                .FirstOrDefaultAsync(m => m.AsociacionId == id);
            if (asociacione == null)
            {
                return NotFound();
            }

            return View(asociacione);
        }

        // POST: Asociaciones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var asociacione = await _context.Asociaciones.FindAsync(id);
            _context.Asociaciones.Remove(asociacione);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AsociacioneExists(int id)
        {
            return _context.Asociaciones.Any(e => e.AsociacionId == id);
        }
    }
}
