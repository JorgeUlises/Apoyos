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
    public class DiputadoesController : Controller
    {
        private readonly dbAccionesContext _context;

        public DiputadoesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Diputadoes
        public async Task<IActionResult> Index()
        {
            return View(await _context.Diputados.ToListAsync());
        }

        // GET: Diputadoes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var diputado = await _context.Diputados
                .FirstOrDefaultAsync(m => m.DiputadoId == id);
            if (diputado == null)
            {
                return NotFound();
            }

            return View(diputado);
        }

        // GET: Diputadoes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Diputadoes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("DiputadoId,Nombre,Paterno,Materno,LegislaturaId,Notas,Estatus,PartidoId,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Diputado diputado)
        {
            if (ModelState.IsValid)
            {
                _context.Add(diputado);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(diputado);
        }

        // GET: Diputadoes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var diputado = await _context.Diputados.FindAsync(id);
            if (diputado == null)
            {
                return NotFound();
            }
            return View(diputado);
        }

        // POST: Diputadoes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("DiputadoId,Nombre,Paterno,Materno,LegislaturaId,Notas,Estatus,PartidoId,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Diputado diputado)
        {
            if (id != diputado.DiputadoId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(diputado);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DiputadoExists(diputado.DiputadoId))
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
            return View(diputado);
        }

        // GET: Diputadoes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var diputado = await _context.Diputados
                .FirstOrDefaultAsync(m => m.DiputadoId == id);
            if (diputado == null)
            {
                return NotFound();
            }

            return View(diputado);
        }

        // POST: Diputadoes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var diputado = await _context.Diputados.FindAsync(id);
            _context.Diputados.Remove(diputado);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DiputadoExists(int id)
        {
            return _context.Diputados.Any(e => e.DiputadoId == id);
        }
    }
}
