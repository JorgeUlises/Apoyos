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
    public class EstatusGestionsController : Controller
    {
        private readonly dbAccionesContext _context;

        public EstatusGestionsController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: EstatusGestions
        public async Task<IActionResult> Index()
        {
            return View(await _context.EstatusGestion.ToListAsync());
        }

        // GET: EstatusGestions/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusGestion = await _context.EstatusGestion
                .FirstOrDefaultAsync(m => m.EstatusGestionId == id);
            if (estatusGestion == null)
            {
                return NotFound();
            }

            return View(estatusGestion);
        }

        // GET: EstatusGestions/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: EstatusGestions/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EstatusGestionId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] EstatusGestion estatusGestion)
        {
            if (ModelState.IsValid)
            {
                _context.Add(estatusGestion);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(estatusGestion);
        }

        // GET: EstatusGestions/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusGestion = await _context.EstatusGestion.FindAsync(id);
            if (estatusGestion == null)
            {
                return NotFound();
            }
            return View(estatusGestion);
        }

        // POST: EstatusGestions/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EstatusGestionId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] EstatusGestion estatusGestion)
        {
            if (id != estatusGestion.EstatusGestionId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(estatusGestion);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EstatusGestionExists(estatusGestion.EstatusGestionId))
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
            return View(estatusGestion);
        }

        // GET: EstatusGestions/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusGestion = await _context.EstatusGestion
                .FirstOrDefaultAsync(m => m.EstatusGestionId == id);
            if (estatusGestion == null)
            {
                return NotFound();
            }

            return View(estatusGestion);
        }

        // POST: EstatusGestions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var estatusGestion = await _context.EstatusGestion.FindAsync(id);
            _context.EstatusGestion.Remove(estatusGestion);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EstatusGestionExists(int id)
        {
            return _context.EstatusGestion.Any(e => e.EstatusGestionId == id);
        }
    }
}
