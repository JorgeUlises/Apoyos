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
    public class MunicipiosController : Controller
    {
        private readonly dbAccionesContext _context;

        public MunicipiosController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Municipios
        public async Task<IActionResult> Index()
        {
            return View(await _context.Municipios.ToListAsync());
        }

        // GET: Municipios/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var municipios = await _context.Municipios
                .FirstOrDefaultAsync(m => m.MunicipioId == id);
            if (municipios == null)
            {
                return NotFound();
            }

            return View(municipios);
        }

        // GET: Municipios/Create
        public IActionResult Create()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            
            return View();
        }

        // POST: Municipios/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MunicipioId,Nombre,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Municipios municipios)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            

            municipios.FechaRegistro = DateTime.Now;
            municipios.FechaUltimoCambio = DateTime.Now;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            municipios.UsuarioRegistro = idUsr;

            if (ModelState.IsValid)
            {
                _context.Add(municipios);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(municipios);
        }

        // GET: Municipios/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var municipios = await _context.Municipios.FindAsync(id);
            if (municipios == null)
            {
                return NotFound();
            }
            return View(municipios);
        }

        // POST: Municipios/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("MunicipioId,Nombre,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Municipios municipios)
        {
            if (id != municipios.MunicipioId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(municipios);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MunicipiosExists(municipios.MunicipioId))
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
            return View(municipios);
        }

        // GET: Municipios/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var municipios = await _context.Municipios
                .FirstOrDefaultAsync(m => m.MunicipioId == id);
            if (municipios == null)
            {
                return NotFound();
            }

            return View(municipios);
        }

        // POST: Municipios/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var municipios = await _context.Municipios.FindAsync(id);
            _context.Municipios.Remove(municipios);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MunicipiosExists(int id)
        {
            return _context.Municipios.Any(e => e.MunicipioId == id);
        }
    }
}
