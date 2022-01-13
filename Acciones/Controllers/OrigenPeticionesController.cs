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
    public class OrigenPeticionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public OrigenPeticionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: OrigenPeticiones
        public async Task<IActionResult> Index()
        {
            return View(await _context.OrigenPeticiones.ToListAsync());
        }

        // GET: OrigenPeticiones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var origenPeticione = await _context.OrigenPeticiones
                .FirstOrDefaultAsync(m => m.OrigenPeticionesId == id);
            if (origenPeticione == null)
            {
                return NotFound();
            }

            return View(origenPeticione);
        }

        // GET: OrigenPeticiones/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: OrigenPeticiones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("OrigenPeticionesId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] OrigenPeticione origenPeticione)
        {
            if (ModelState.IsValid)
            {
                _context.Add(origenPeticione);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(origenPeticione);
        }

        // GET: OrigenPeticiones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var origenPeticione = await _context.OrigenPeticiones.FindAsync(id);
            if (origenPeticione == null)
            {
                return NotFound();
            }
            return View(origenPeticione);
        }

        // POST: OrigenPeticiones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("OrigenPeticionesId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] OrigenPeticione origenPeticione)
        {
            if (id != origenPeticione.OrigenPeticionesId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(origenPeticione);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrigenPeticioneExists(origenPeticione.OrigenPeticionesId))
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
            return View(origenPeticione);
        }

        // GET: OrigenPeticiones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var origenPeticione = await _context.OrigenPeticiones
                .FirstOrDefaultAsync(m => m.OrigenPeticionesId == id);
            if (origenPeticione == null)
            {
                return NotFound();
            }

            return View(origenPeticione);
        }

        // POST: OrigenPeticiones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var origenPeticione = await _context.OrigenPeticiones.FindAsync(id);
            _context.OrigenPeticiones.Remove(origenPeticione);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool OrigenPeticioneExists(int id)
        {
            return _context.OrigenPeticiones.Any(e => e.OrigenPeticionesId == id);
        }
    }
}
