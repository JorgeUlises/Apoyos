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
    public class EstatusPeticionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public EstatusPeticionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: EstatusPeticiones
        public async Task<IActionResult> Index()
        {
            return View(await _context.EstatusPeticiones.ToListAsync());
        }

        // GET: EstatusPeticiones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusPeticione = await _context.EstatusPeticiones
                .FirstOrDefaultAsync(m => m.EstatusPeticionesId == id);
            if (estatusPeticione == null)
            {
                return NotFound();
            }

            return View(estatusPeticione);
        }

        // GET: EstatusPeticiones/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: EstatusPeticiones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EstatusPeticionesId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] EstatusPeticione estatusPeticione)
        {
            if (ModelState.IsValid)
            {
                _context.Add(estatusPeticione);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(estatusPeticione);
        }

        // GET: EstatusPeticiones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusPeticione = await _context.EstatusPeticiones.FindAsync(id);
            if (estatusPeticione == null)
            {
                return NotFound();
            }
            return View(estatusPeticione);
        }

        // POST: EstatusPeticiones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EstatusPeticionesId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] EstatusPeticione estatusPeticione)
        {
            if (id != estatusPeticione.EstatusPeticionesId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(estatusPeticione);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EstatusPeticioneExists(estatusPeticione.EstatusPeticionesId))
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
            return View(estatusPeticione);
        }

        // GET: EstatusPeticiones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusPeticione = await _context.EstatusPeticiones
                .FirstOrDefaultAsync(m => m.EstatusPeticionesId == id);
            if (estatusPeticione == null)
            {
                return NotFound();
            }

            return View(estatusPeticione);
        }

        // POST: EstatusPeticiones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var estatusPeticione = await _context.EstatusPeticiones.FindAsync(id);
            _context.EstatusPeticiones.Remove(estatusPeticione);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EstatusPeticioneExists(int id)
        {
            return _context.EstatusPeticiones.Any(e => e.EstatusPeticionesId == id);
        }
    }
}
