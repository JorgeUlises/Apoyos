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
    public class DependenciasController : Controller
    {
        private readonly dbAccionesContext _context;

        public DependenciasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Dependencias
        public async Task<IActionResult> Index()
        {
            var dbAccionesContext = _context.Dependencias.Include(d => d.Calle).Include(d => d.Colonia);
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Dependencias/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dependencia = await _context.Dependencias
                .Include(d => d.Calle)
                .Include(d => d.Colonia)
                .FirstOrDefaultAsync(m => m.DependenciaId == id);
            if (dependencia == null)
            {
                return NotFound();
            }

            return View(dependencia);
        }

        // GET: Dependencias/Create
        public IActionResult Create()
        {
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle");
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            return View();
        }

        // POST: Dependencias/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("DependenciaId,NombreDependecia,Descripcion,NombreContacto,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Dependencia dependencia)
        {
            if (ModelState.IsValid)
            {
                _context.Add(dependencia);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", dependencia.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", dependencia.ColoniaId);
            return View(dependencia);
        }

        // GET: Dependencias/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dependencia = await _context.Dependencias.FindAsync(id);
            if (dependencia == null)
            {
                return NotFound();
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", dependencia.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", dependencia.ColoniaId);
            return View(dependencia);
        }

        // POST: Dependencias/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("DependenciaId,NombreDependecia,Descripcion,NombreContacto,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Dependencia dependencia)
        {
            if (id != dependencia.DependenciaId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(dependencia);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DependenciaExists(dependencia.DependenciaId))
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
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", dependencia.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", dependencia.ColoniaId);
            return View(dependencia);
        }

        // GET: Dependencias/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dependencia = await _context.Dependencias
                .Include(d => d.Calle)
                .Include(d => d.Colonia)
                .FirstOrDefaultAsync(m => m.DependenciaId == id);
            if (dependencia == null)
            {
                return NotFound();
            }

            return View(dependencia);
        }

        // POST: Dependencias/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var dependencia = await _context.Dependencias.FindAsync(id);
            _context.Dependencias.Remove(dependencia);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DependenciaExists(int id)
        {
            return _context.Dependencias.Any(e => e.DependenciaId == id);
        }
    }
}
