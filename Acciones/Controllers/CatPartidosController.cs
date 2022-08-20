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
    public class CatPartidosController : Controller
    {
        private readonly dbAccionesContext _context;

        public CatPartidosController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: CatPartidos
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            return View(await _context.CatPartidos.ToListAsync());
        }

        // GET: CatPartidos/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catPartidos = await _context.CatPartidos
                .FirstOrDefaultAsync(m => m.PartidoId == id);
            if (catPartidos == null)
            {
                return NotFound();
            }

            return View(catPartidos);
        }

        // GET: CatPartidos/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CatPartidos/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PartidoId,Nombre,Logotipo,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] CatPartidos catPartidos)
        {
            if (ModelState.IsValid)
            {
                _context.Add(catPartidos);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(catPartidos);
        }

        // GET: CatPartidos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catPartidos = await _context.CatPartidos.FindAsync(id);
            if (catPartidos == null)
            {
                return NotFound();
            }
            return View(catPartidos);
        }

        // POST: CatPartidos/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("PartidoId,Nombre,Logotipo,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] CatPartidos catPartidos)
        {
            if (id != catPartidos.PartidoId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(catPartidos);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CatPartidosExists(catPartidos.PartidoId))
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
            return View(catPartidos);
        }

        // GET: CatPartidos/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catPartidos = await _context.CatPartidos
                .FirstOrDefaultAsync(m => m.PartidoId == id);
            if (catPartidos == null)
            {
                return NotFound();
            }

            return View(catPartidos);
        }

        // POST: CatPartidos/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var catPartidos = await _context.CatPartidos.FindAsync(id);
            _context.CatPartidos.Remove(catPartidos);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CatPartidosExists(int id)
        {
            return _context.CatPartidos.Any(e => e.PartidoId == id);
        }
    }
}
