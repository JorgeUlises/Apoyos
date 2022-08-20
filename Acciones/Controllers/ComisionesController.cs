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
    public class ComisionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public ComisionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Comisiones
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();

            return View(await _context.Comisiones.Where(c=>c.LegislaturaId == LegId).ToListAsync());
        }

        // GET: Comisiones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var comisiones = await _context.Comisiones
                .FirstOrDefaultAsync(m => m.ComisionId == id);
            if (comisiones == null)
            {
                return NotFound();
            }

            return View(comisiones);
        }

        // GET: Comisiones/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Comisiones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ComisionId,Nombre,NumeroSecuencial,LegislaturaId,Comentario,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioregistroId")] Comisiones comisiones)
        {
            if (ModelState.IsValid)
            {
                var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
                comisiones.LegislaturaId = LegId;
                comisiones.Estatus = 1;
                _context.Add(comisiones);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(comisiones);
        }

        // GET: Comisiones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var comisiones = await _context.Comisiones.FindAsync(id);
            if (comisiones == null)
            {
                return NotFound();
            }
            return View(comisiones);
        }

        // POST: Comisiones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ComisionId,Nombre,NumeroSecuencial,LegislaturaId,Comentario,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioregistroId")] Comisiones comisiones)
        {
            if (id != comisiones.ComisionId)
            {
                return NotFound();
            }


            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(comisiones);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ComisionesExists(comisiones.ComisionId))
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
            return View(comisiones);
        }

        // GET: Comisiones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var comisiones = await _context.Comisiones
                .FirstOrDefaultAsync(m => m.ComisionId == id);
            if (comisiones == null)
            {
                return NotFound();
            }

            return View(comisiones);
        }

        // POST: Comisiones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var comisiones = await _context.Comisiones.FindAsync(id);
            _context.Comisiones.Remove(comisiones);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ComisionesExists(int id)
        {
            return _context.Comisiones.Any(e => e.ComisionId == id);
        }
    }
}
