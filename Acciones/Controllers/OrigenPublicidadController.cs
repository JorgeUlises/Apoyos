using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using System.Security.Claims;

namespace Acciones.Controllers
{
    public class OrigenPublicidadController : Controller
    {
        private readonly dbAccionesContext _context;

        public OrigenPublicidadController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: OrigenPublicidad
        public async Task<IActionResult> Index()
        {
            return View(await _context.OrigenPublicidad.ToListAsync());
        }

        // GET: OrigenPublicidad/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var origenPublicidad = await _context.OrigenPublicidad
                .FirstOrDefaultAsync(m => m.OrigenPublicidadId == id);
            if (origenPublicidad == null)
            {
                return NotFound();
            }

            return View(origenPublicidad);
        }

        // GET: OrigenPublicidad/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: OrigenPublicidad/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("OrigenPublicidadId,Nombre,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] OrigenPublicidad origenPublicidad)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            origenPublicidad.FechaRegistro = DateTime.Now;
            origenPublicidad.FechaUltimoCambio = DateTime.Now;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            origenPublicidad.UsuarioRegistro = idUsr;


            if (ModelState.IsValid)
            {
                _context.Add(origenPublicidad);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(origenPublicidad);
        }

        // GET: OrigenPublicidad/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var origenPublicidad = await _context.OrigenPublicidad.FindAsync(id);
            if (origenPublicidad == null)
            {
                return NotFound();
            }
            return View(origenPublicidad);
        }

        // POST: OrigenPublicidad/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("OrigenPublicidadId,Nombre,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] OrigenPublicidad origenPublicidad)
        {
            if (id != origenPublicidad.OrigenPublicidadId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(origenPublicidad);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrigenPublicidadExists(origenPublicidad.OrigenPublicidadId))
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
            return View(origenPublicidad);
        }

        // GET: OrigenPublicidad/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var origenPublicidad = await _context.OrigenPublicidad
                .FirstOrDefaultAsync(m => m.OrigenPublicidadId == id);
            if (origenPublicidad == null)
            {
                return NotFound();
            }

            return View(origenPublicidad);
        }

        // POST: OrigenPublicidad/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var origenPublicidad = await _context.OrigenPublicidad.FindAsync(id);
            _context.OrigenPublicidad.Remove(origenPublicidad);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool OrigenPublicidadExists(int id)
        {
            return _context.OrigenPublicidad.Any(e => e.OrigenPublicidadId == id);
        }
    }
}
