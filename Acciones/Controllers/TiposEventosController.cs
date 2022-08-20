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
    public class TiposEventosController : Controller
    {
        private readonly dbAccionesContext _context;

        public TiposEventosController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: TiposEventos
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            return View(await _context.TiposEvento.ToListAsync());
        }

        // GET: TiposEventos/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var tiposEvento = await _context.TiposEvento
                .FirstOrDefaultAsync(m => m.TipoEventoId == id);
            if (tiposEvento == null)
            {
                return NotFound();
            }

            return View(tiposEvento);
        }

        // GET: TiposEventos/Create
        public IActionResult Create()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            return View();
        }

        // POST: TiposEventos/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("TipoEventoId,Nombre,Descripcion,Estatus,DiputadoId,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] TiposEvento tiposEvento)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            tiposEvento.Descripcion = tiposEvento.Descripcion ?? "";
            tiposEvento.FechaRegistro= DateTime.Now;
            tiposEvento.FechaUltimoCambio = DateTime.Now;
            tiposEvento.Estatus = 1;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            tiposEvento.UsuarioRegistro = idUsr;

            if (ModelState.IsValid)
            {
                _context.Add(tiposEvento);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(tiposEvento);
        }

        // GET: TiposEventos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var tiposEvento = await _context.TiposEvento.FindAsync(id);
            if (tiposEvento == null)
            {
                return NotFound();
            }
            return View(tiposEvento);
        }

        // POST: TiposEventos/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("TipoEventoId,Nombre,Descripcion,Estatus,DiputadoId,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] TiposEvento tiposEvento)
        {
            if (id != tiposEvento.TipoEventoId)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(tiposEvento);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TiposEventoExists(tiposEvento.TipoEventoId))
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
            return View(tiposEvento);
        }

        // GET: TiposEventos/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var tiposEvento = await _context.TiposEvento
                .FirstOrDefaultAsync(m => m.TipoEventoId == id);
            if (tiposEvento == null)
            {
                return NotFound();
            }

            return View(tiposEvento);
        }

        // POST: TiposEventos/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var tiposEvento = await _context.TiposEvento.FindAsync(id);
            _context.TiposEvento.Remove(tiposEvento);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool TiposEventoExists(int id)
        {
            return _context.TiposEvento.Any(e => e.TipoEventoId == id);
        }
    }
}
