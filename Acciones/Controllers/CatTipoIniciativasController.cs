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
    public class CatTipoIniciativasController : Controller
    {
        private readonly dbAccionesContext _context;

        public CatTipoIniciativasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: CatTipoIniciativas
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            return View(await _context.CatTipoIniciativas.ToListAsync());
        }

        // GET: CatTipoIniciativas/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catTipoIniciativa = await _context.CatTipoIniciativas
                .FirstOrDefaultAsync(m => m.CatTipoIniciativaId == id);
            if (catTipoIniciativa == null)
            {
                return NotFound();
            }

            return View(catTipoIniciativa);
        }

        // GET: CatTipoIniciativas/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CatTipoIniciativas/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CatTipoIniciativaId,Nombre,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] CatTipoIniciativa catTipoIniciativa)
        {
            if (ModelState.IsValid)
            {
                _context.Add(catTipoIniciativa);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(catTipoIniciativa);
        }

        // GET: CatTipoIniciativas/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catTipoIniciativa = await _context.CatTipoIniciativas.FindAsync(id);
            if (catTipoIniciativa == null)
            {
                return NotFound();
            }
            return View(catTipoIniciativa);
        }

        // POST: CatTipoIniciativas/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CatTipoIniciativaId,Nombre,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] CatTipoIniciativa catTipoIniciativa)
        {
            if (id != catTipoIniciativa.CatTipoIniciativaId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(catTipoIniciativa);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CatTipoIniciativaExists(catTipoIniciativa.CatTipoIniciativaId))
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
            return View(catTipoIniciativa);
        }

        // GET: CatTipoIniciativas/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catTipoIniciativa = await _context.CatTipoIniciativas
                .FirstOrDefaultAsync(m => m.CatTipoIniciativaId == id);
            if (catTipoIniciativa == null)
            {
                return NotFound();
            }

            return View(catTipoIniciativa);
        }

        // POST: CatTipoIniciativas/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var catTipoIniciativa = await _context.CatTipoIniciativas.FindAsync(id);
            _context.CatTipoIniciativas.Remove(catTipoIniciativa);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CatTipoIniciativaExists(int id)
        {
            return _context.CatTipoIniciativas.Any(e => e.CatTipoIniciativaId == id);
        }
    }
}
