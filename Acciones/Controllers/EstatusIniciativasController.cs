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
    public class EstatusIniciativasController : Controller
    {
        private readonly dbAccionesContext _context;

        public EstatusIniciativasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: EstatusIniciativas
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            return View(await _context.EstatusIniciativas.ToListAsync());
        }

        // GET: EstatusIniciativas/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusIniciativas = await _context.EstatusIniciativas
                .FirstOrDefaultAsync(m => m.EstatusIniciativasId == id);
            if (estatusIniciativas == null)
            {
                return NotFound();
            }

            return View(estatusIniciativas);
        }

        // GET: EstatusIniciativas/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: EstatusIniciativas/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EstatusIniciativasId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] EstatusIniciativas estatusIniciativas)
        {
            if (ModelState.IsValid)
            {
                _context.Add(estatusIniciativas);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(estatusIniciativas);
        }

        // GET: EstatusIniciativas/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusIniciativas = await _context.EstatusIniciativas.FindAsync(id);
            if (estatusIniciativas == null)
            {
                return NotFound();
            }
            return View(estatusIniciativas);
        }

        // POST: EstatusIniciativas/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EstatusIniciativasId,Nombre,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] EstatusIniciativas estatusIniciativas)
        {
            if (id != estatusIniciativas.EstatusIniciativasId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(estatusIniciativas);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EstatusIniciativasExists(estatusIniciativas.EstatusIniciativasId))
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
            return View(estatusIniciativas);
        }

        // GET: EstatusIniciativas/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var estatusIniciativas = await _context.EstatusIniciativas
                .FirstOrDefaultAsync(m => m.EstatusIniciativasId == id);
            if (estatusIniciativas == null)
            {
                return NotFound();
            }

            return View(estatusIniciativas);
        }

        // POST: EstatusIniciativas/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var estatusIniciativas = await _context.EstatusIniciativas.FindAsync(id);
            _context.EstatusIniciativas.Remove(estatusIniciativas);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EstatusIniciativasExists(int id)
        {
            return _context.EstatusIniciativas.Any(e => e.EstatusIniciativasId == id);
        }
    }
}
