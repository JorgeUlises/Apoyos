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
    public class TipoPublicidadController : Controller
    {
        private readonly dbAccionesContext _context;

        public TipoPublicidadController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: TipoPublicidad
        public async Task<IActionResult> Index()
        {
            return View(await _context.TipoPublicidad.ToListAsync());
        }

        // GET: TipoPublicidad/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var tipoPublicidad = await _context.TipoPublicidad
                .FirstOrDefaultAsync(m => m.TipoPublicidadId == id);
            if (tipoPublicidad == null)
            {
                return NotFound();
            }

            return View(tipoPublicidad);
        }

        // GET: TipoPublicidad/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: TipoPublicidad/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("TipoPublicidadId,Nombre,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] TipoPublicidad tipoPublicidad)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            tipoPublicidad.FechaRegistro = DateTime.Now;
            tipoPublicidad.FechaUltimoCambio = DateTime.Now;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            tipoPublicidad.UsuarioRegistro = idUsr;

            if (ModelState.IsValid)
            {
                _context.Add(tipoPublicidad);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(tipoPublicidad);
        }

        // GET: TipoPublicidad/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var tipoPublicidad = await _context.TipoPublicidad.FindAsync(id);
            if (tipoPublicidad == null)
            {
                return NotFound();
            }
            return View(tipoPublicidad);
        }

        // POST: TipoPublicidad/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("TipoPublicidadId,Nombre,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] TipoPublicidad tipoPublicidad)
        {
            if (id != tipoPublicidad.TipoPublicidadId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(tipoPublicidad);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TipoPublicidadExists(tipoPublicidad.TipoPublicidadId))
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
            return View(tipoPublicidad);
        }

        // GET: TipoPublicidad/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var tipoPublicidad = await _context.TipoPublicidad
                .FirstOrDefaultAsync(m => m.TipoPublicidadId == id);
            if (tipoPublicidad == null)
            {
                return NotFound();
            }

            return View(tipoPublicidad);
        }

        // POST: TipoPublicidad/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var tipoPublicidad = await _context.TipoPublicidad.FindAsync(id);
            _context.TipoPublicidad.Remove(tipoPublicidad);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool TipoPublicidadExists(int id)
        {
            return _context.TipoPublicidad.Any(e => e.TipoPublicidadId == id);
        }
    }
}
