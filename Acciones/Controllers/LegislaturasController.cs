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
    public class LegislaturasController : Controller
    {
        private readonly dbAccionesContext _context;

        public LegislaturasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Legislaturas
        public async Task<IActionResult> Index()
        {
            return View(await _context.Legislaturas.ToListAsync());
        }

        // GET: Legislaturas/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var legislatura = await _context.Legislaturas
                .FirstOrDefaultAsync(m => m.LegislaturaId == id);
            if (legislatura == null)
            {
                return NotFound();
            }

            return View(legislatura);
        }

        // GET: Legislaturas/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Legislaturas/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("LegislaturaId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Legislatura legislatura)
        {
            if (ModelState.IsValid)
            {
                _context.Add(legislatura);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(legislatura);
        }

        // GET: Legislaturas/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var legislatura = await _context.Legislaturas.FindAsync(id);
            if (legislatura == null)
            {
                return NotFound();
            }
            return View(legislatura);
        }

        // POST: Legislaturas/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("LegislaturaId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Legislatura legislatura)
        {
            if (id != legislatura.LegislaturaId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(legislatura);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LegislaturaExists(legislatura.LegislaturaId))
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
            return View(legislatura);
        }

        // GET: Legislaturas/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var legislatura = await _context.Legislaturas
                .FirstOrDefaultAsync(m => m.LegislaturaId == id);
            if (legislatura == null)
            {
                return NotFound();
            }

            return View(legislatura);
        }

        // POST: Legislaturas/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var legislatura = await _context.Legislaturas.FindAsync(id);
            _context.Legislaturas.Remove(legislatura);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool LegislaturaExists(int id)
        {
            return _context.Legislaturas.Any(e => e.LegislaturaId == id);
        }
    }
}
